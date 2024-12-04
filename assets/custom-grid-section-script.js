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

// sizepicker open / close
const toggleSizepickers = document.querySelectorAll(".toggle-sizepicker");
// const sizepickerTitles = document.querySelectorAll(".sizepicker p");
const sizepickerIcons = document.querySelectorAll(".sizepicker .arrow img");
const sizepickerMenus = document.querySelectorAll(".sizepicker-menu");

let isMenuOpen = false;
function openSizepicker(e) {
  isMenuOpen = true;
  // sizepickerTitle.innerHTML = "Choose your size";
  const index = e.currentTarget.dataset.index;
  console.log(
    document.querySelector(`.toggle-sizepicker[data-index='${index}'] p`),
  );
  document.querySelector(
    `.toggle-sizepicker[data-index='${index}'] p`,
  ).innerHTML = "Choose your size";
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
function closeSizePicker(e) {
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

toggleSizepickers.forEach((ele) => {
  ele.addEventListener("click", openSizepicker);
});

sizepickerIcons.forEach((ele) => {
  ele.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!isMenuOpen) {
      openSizepicker(e);
    } else {
      closeSizePicker(e);
    }
  });
});

let selectedSize;
sizepickerMenus.forEach((ele) => {
  ele.addEventListener("click", (e) => {
    // sizepickerTitle.innerHTML = e.target.innerHTML;
    document.querySelector(
      `.toggle-sizepicker[data-index='${ele.dataset.index}'] p`,
    ).innerHTML = e.target.innerHTML;
    closeSizePicker(e);
    console.log(e.target, e);
    selectedSize = e.target.dataset.value;
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
