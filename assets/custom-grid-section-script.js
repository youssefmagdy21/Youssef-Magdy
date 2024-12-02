const root = document.querySelector(":root");
// popup
const productPopupButtons = document.querySelectorAll(".product-popup__btn");
const productPopupContainer = document.querySelector(
  ".product-popup__container",
);
const productPopupWindow = document.querySelector(".product-popup__window");
const productPopupExit = document.querySelector(".product-popup__exit");

function closePopup(e) {
  productPopupContainer.classList.remove("active");
  document.body.style.overflowY = "visible";
}
function openPopup(e) {
  productPopupContainer.classList.add("active");
  document.body.style.overflowY = "hidden";
  console.log(e);
}

productPopupButtons.forEach((element) => {
  element.addEventListener("click", openPopup);
});

// close popup when clicked anywhere outside the popup window
productPopupContainer.addEventListener("click", (e) => {
  if (
    e.target !== productPopupWindow &&
    !productPopupWindow.contains(e.target)
  ) {
    closePopup(e);
  }
});

productPopupExit.addEventListener("click", closePopup);

// set color of selections from input value
const colorChoice1 = document.querySelector("#color-1").value;
const colorChoice2 = document.querySelector("#color-2").value;

root.style.setProperty("--radio-choice-clr-1", colorChoice1);
root.style.setProperty("--radio-choice-clr-2", colorChoice2);

// sizepicker open / close
const toggleSizepicker = document.querySelector(".toggle-sizepicker");
const sizepickerTitle = document.querySelector(".sizepicker p");
const sizepickerIcon = document.querySelector(".sizepicker .arrow img");
const sizepickerMenu = document.querySelector(".sizepicker .sizepicker-menu");
let isMenuOpen = false;
function openSizepicker() {
  isMenuOpen = true;
  sizepickerTitle.innerHTML = "Choose your size";
  sizepickerMenu.classList.add("active");
  sizepickerIcon.classList.add("active");
  toggleSizepicker.classList.add("active");
}
function closeSizePicker() {
  isMenuOpen = false;
  sizepickerMenu.classList.remove("active");
  sizepickerIcon.classList.remove("active");
  toggleSizepicker.classList.remove("active");
}

toggleSizepicker.addEventListener("click", openSizepicker);

sizepickerIcon.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!isMenuOpen) {
    openSizepicker();
  } else {
    closeSizePicker();
  }
});

sizepickerMenu.addEventListener("click", (e) => {
  sizepickerTitle.innerHTML = e.target.innerHTML;
  closeSizePicker();
});
