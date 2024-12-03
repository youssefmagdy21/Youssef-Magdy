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

sizepickerMenus.forEach((ele) => {
  ele.addEventListener("click", (e) => {
    // sizepickerTitle.innerHTML = e.target.innerHTML;
    closeSizePicker(e);
    console.log(e.currentTarget);
  });
});

// product add to cart form
const popupForms = document.querySelectorAll(".product-popup__addtocart-form");

popupForms.forEach((ele) => {
  ele.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("form submited ", e);
  });
});
