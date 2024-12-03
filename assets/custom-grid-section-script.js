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

// get all variants available for the selected product
function getCurrentProductOptions(idx) {
  const productVariants = JSON.parse(
    document.querySelector(`.product-variants[data-index='${idx}']`)
      .textContent,
  );
  console.log(productVariants);
  const productOptions = productVariants.map((ele) => {
    return { id: ele.id, variant: `${ele.option1}/${ele.option2}` };
  });

  console.log(productOptions);
  return productOptions;
}

console.log(getCurrentProductOptions("3"));

popupForms.forEach((ele) => {
  ele.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(ele);
    console.log("form submited ", e);
    for (const p of formData) {
      console.log(p[0], " --> ", p[1]);
    }
    const colorVariantId = formData.get("color");
    const sizeVariantId = selectedSize;
    console.log(sizeVariantId);
    formData.set("size", sizeVariantId);

    const res = await fetch("/cart/add", {
      method: "post",
      body: formData,
    });
  });
});
