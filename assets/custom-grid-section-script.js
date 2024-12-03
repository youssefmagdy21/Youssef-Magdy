const root = document.querySelector(":root");

const productPopupButtons = document.querySelectorAll(".product-popup__btn");
const productPopupContainers = document.querySelectorAll(
  ".product-popup__container",
);
const productPopupWindows = document.querySelectorAll(".product-popup__window");
const productPopupExits = document.querySelectorAll(".product-popup__exit");

// open popup screen for selected product
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

productPopupButtons.forEach((element) => {
  element.addEventListener("click", openPopup);
});

// close active popup screen
function closePopup() {
  productPopupContainers.forEach((ele) => {
    ele.classList.remove("active");
  });
  document.body.style.overflowY = "visible";
}

productPopupExits.forEach((ele) => {
  ele.addEventListener("click", closePopup);
});

// close popup when clicked anywhere outside the popup window
productPopupContainers.forEach((ele) => {
  let productWindow = ele.querySelector(".product-popup__window");
  ele.addEventListener("click", (e) => {
    if (e.target !== productWindow && !productWindow.contains(e.target)) {
      closePopup();
    }
  });
});

// sizepicker open / close
const toggleSizepickers = document.querySelectorAll(".toggle-sizepicker");
// const sizepickerTitles = document.querySelectorAll(".sizepicker p");
const sizepickerIcons = document.querySelectorAll(".sizepicker .arrow img");
const sizepickerMenus = document.querySelectorAll(
  ".sizepicker .sizepicker-menu",
);

let isMenuOpen = false;
function openSizepicker(e) {
  isMenuOpen = true;
  // sizepickerTitle.innerHTML = "Choose your size";
  const index = e.currentTarget.dataset.index;
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
    closeSizePicker(e);
    console.log(e.target, e);
    selectedSize = e.target.dataset.value;
  });
});

// product add to cart form
const popupForms = document.querySelectorAll(".product-popup__addtocart-form");

// function that takes a product index and returns all available variants for that product
function getCurrentProductOptions(idx) {
  const productVariants = JSON.parse(
    document.querySelector(`.product-variants[data-index='${idx}']`)
      .textContent,
  );
  const productOptions = productVariants.map((ele) => {
    const variant = ele.options.join("/");
    return { id: ele.id, variant: variant };
  });
  return productOptions;
}
function getSelectedVariantID(selectedVariant, idx) {
  const productOptions = getCurrentProductOptions(idx);
  console.log(productOptions);
  let selectedVariantID;
  productOptions.forEach((ele) => {
    if (ele.variant === selectedVariant) {
      selectedVariantID = ele.id;
      return;
    }
  });

  return selectedVariantID;
}
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

    console.log(selectedVariant, selectedVariantID);
    console.log("form submited ", e);
    for (const p of formData) {
      console.log(p[0], " --> ", p[1]);
    }

    const res = await fetch("/cart/add", {
      method: "post",
      body: formData,
    });
    if (res.ok) {
      console.log("ADDED");
      window.location.replace("/cart");
    }
  });
});

// popupForms.forEach((form) => {
//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const formData = new FormData(form);
//     console.log("form submited ", e);
//     for (const p of formData) {
//       console.log(p[0], " --> ", p[1]);
//     }
//     const colorVariantId = formData.get("color");
//     const sizeVariantId = selectedSize;
//     console.log(sizeVariantId);
//     formData.set("size", sizeVariantId);

//     const res = await fetch("/cart/add", {
//       method: "post",
//       body: formData,
//     });
//   });
// });
