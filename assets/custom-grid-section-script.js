// global object to handle the state of the currently selected size
let currentlySelectedSize = {
  selectedSize: "",
  setSelectedSize: function (selection) {
    this.selectedSize = selection;
  },
  getSelectedSize: function () {
    return this.selectedSize;
  },
  resetSelectedSize: function () {
    this.selectedSize = "";
  },
};
// ------------------- Product Popup Screen ------------------- //
// function to open popup screen for selected product
function openPopup(e) {
  const index = e.currentTarget.dataset.index;
  productPopupContainers.forEach((ele) => {
    if (ele.dataset.index === index) {
      ele.classList.add("active");
      return;
    }
  });
  document.body.style.overflowY = "hidden";
}
// function to close currently active popup screen
function closePopup() {
  productPopupContainers.forEach((ele) => {
    ele.classList.remove("active");
  });
  document.body.style.overflowY = "visible";
}
// select all product popup buttons and add event listeners to open popup
const productPopupButtons = document.querySelectorAll(".product-popup__btn");
productPopupButtons.forEach((element) => {
  element.addEventListener("click", openPopup);
});
// select all product popup exit buttons and add event listeners to close popup
const productPopupExits = document.querySelectorAll(".product-popup__exit");
productPopupExits.forEach((ele) => {
  ele.addEventListener("click", closePopup);
});
// select all product popup containers and add event listeners to close popup when clicked anywhere outside the popup window
const productPopupContainers = document.querySelectorAll(
  ".product-popup__container",
);
productPopupContainers.forEach((ele) => {
  const productWindow = ele.querySelector(".product-popup__window");
  ele.addEventListener("click", (e) => {
    if (e.target !== productWindow && !productWindow.contains(e.target)) {
      closePopup();
    }
  });
});
// ------------------- Product Popup Screen ------------------- //

// ------------------- Sizepicker ------------------- //
// boolean to determine the state of the sizepicker menu
let isMenuOpen = false;
// function that takes index of current sizepicker and opens the sizepicker menu
function openSizepicker(index) {
  isMenuOpen = true;
  currentlySelectedSize.resetSelectedSize();
  changeSizePickerTitle();
  sizepickerMenus.forEach((ele) => {
    if (ele.dataset.index === index) {
      ele.classList.add("active");
      return;
    }
  });
  sizepickerIcons.forEach((ele) => {
    if (ele.dataset.index === index) {
      ele.classList.add("active");
      return;
    }
  });
  toggleSizepickers.forEach((ele) => {
    if (ele.dataset.index === index) {
      ele.classList.add("active");
      return;
    }
  });
}
// function to close the sizepicker menu
function closeSizePicker() {
  isMenuOpen = false;
  sizepickerMenus.forEach((ele) => {
    ele.classList.remove("active");
  });
  sizepickerIcons.forEach((ele) => {
    ele.classList.remove("active");
  });
  toggleSizepickers.forEach((ele) => {
    ele.classList.remove("active");
  });
}
// function that takes index and value of current size and changes the sizepicker title
function changeSizePickerTitle(value) {
  const defaultTitle = "Choose your size";
  document.querySelectorAll(`.toggle-sizepicker p`).forEach((ele) => {
    if (value) {
      ele.title.innerHTML = value;
      ele.title.style.setProperty("--text-align", "center");
    } else {
      ele.title.innerHTML = defaultTitle;
      ele.title.style.setProperty("--text-align", "left");
    }
  });
}
// select all sizepickers toggle elements and add event listeners to open sizepicker menu
const toggleSizepickers = document.querySelectorAll(".toggle-sizepicker");
toggleSizepickers.forEach((ele) => {
  ele.addEventListener("click", () => openSizepicker(ele.dataset.index));
});
// select all sizepickers toggle icons and add event listeners to open sizepicker menu
// and to close the menu if open
const sizepickerIcons = document.querySelectorAll(".sizepicker .arrow img");
sizepickerIcons.forEach((ele) => {
  ele.addEventListener("click", (e) => {
    // to close using the exact target [arrow icon] only -same behaviour as in the design-
    e.stopPropagation();
    if (!isMenuOpen) {
      openSizepicker(ele.dataset.index);
    } else {
      closeSizePicker();
    }
  });
});
// select all sizepicker menus and add event listeners to handle size selection
const sizepickerMenus = document.querySelectorAll(".sizepicker-menu");
sizepickerMenus.forEach((ele) => {
  ele.addEventListener("click", (e) => {
    changeSizePickerTitle(e.target.innerHTML);
    currentlySelectedSize.setSelectedSize(e.target.dataset.value);
    closeSizePicker();
  });
});
// ------------------- Sizepicker ------------------- //

// ------------------- Form Submission ------------------- //
// function that takes a productVariants array and returns all available options for that product
function getProductOptions(productVariants) {
  return productVariants.map((ele) => {
    const variant = ele.options.join("/");
    return { id: ele.id, variant: variant };
  });
}
// function that takes a productOptions array and a variant and returns the variant id
function getVariantID(productOptions, variant) {
  let variantID;
  productOptions.forEach((ele) => {
    if (ele.variant === variant) {
      variantID = ele.id;
      return;
    }
  });

  return variantID;
}
// function that takes the current index and returns all available options for current product
function getCurrentProductOptions(idx) {
  const productVariants = JSON.parse(
    document.querySelector(`.product-variants[data-index='${idx}']`)
      .textContent,
  );

  return getProductOptions(productVariants);
}
// function that takes the current selectedVariant and current index and returns the variant id
function getSelectedVariantID(selectedVariant, idx) {
  const productOptions = getCurrentProductOptions(idx);

  return getVariantID(productOptions, selectedVariant);
}
// function that takes a variant and returns the variant id for the extra product
function getExtraProductVariantID(variant) {
  const extra_product = JSON.parse(
    document.querySelector("script[data-extra-product]").textContent,
  );
  const options = getProductOptions(extra_product.variants);
  return getVariantID(options, variant);
}
// function that takes the extra product variant id and adds that product to cart automatically
async function addExtraProduct(id) {
  const extraProductData = {
    items: [
      {
        id: id,
        quantity: 1,
      },
    ],
  };
  const res = await fetch("/cart/add", {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(extraProductData),
  });

  return res;
}
// select all popup forms and add the submit event listner to add products to cart
const popupForms = document.querySelectorAll(".product-popup__addtocart-form");
popupForms.forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const selectedColor = formData.get("color");
    const selectedSize = currentlySelectedSize.getSelectedSize();
    const selectedVariant = `${selectedSize}/${selectedColor}`;
    const selectedVariantID = getSelectedVariantID(
      selectedVariant,
      form.dataset.index,
    );
    formData.set("size", selectedSize);
    formData.set("id", selectedVariantID);
    try {
      const res = await fetch("/cart/add", {
        method: "post",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("something went wrong...");
      }
      // add and extra product automatically for M/Black products
      if (selectedVariant === "M/Black") {
        const id = getExtraProductVariantID(selectedVariant);
        const extraProductRes = await addExtraProduct(id);
        if (!extraProductRes.ok) {
          throw new Error("something went wrong...");
        }
      }
      // redirect to cart after adding a product from the popup
      window.location.assign("/cart");
    } catch (error) {
      console.error(error);
    }
  });
});
// ------------------- Form Submission ------------------- //
