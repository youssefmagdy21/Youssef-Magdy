const root = document.querySelector(":root");

const productPopupButtons = document.querySelectorAll(".product-popup__btn");
const productPopupContainers = document.querySelectorAll(
  ".product-popup__container",
);
const productPopupContainerActive = document.querySelector(
  ".product-popup__container.active",
);

// open popup screen for selected product
function openPopup(e) {
  const index = e.currentTarget.dataset.index;
  console.log(e, index);
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
  productPopupContainerActive.classList.remove("active");
  document.body.style.overflowY = "visible";
}

if (productPopupContainerActive) {
  const productPopupWindowActive = productPopupContainerActive.querySelector(
    ".product-popup__window",
  );
  const productPopupExitActive = productPopupContainerActive.querySelector(
    ".product-popup__exit",
  );
  productPopupExitActive.addEventListener("click", closePopup);
  // close popup when clicked anywhere outside the popup window
  productPopupContainerActive.addEventListener("click", (e) => {
    if (
      e.target !== productPopupWindowActive &&
      !productPopupWindowActive.contains(e.target)
    ) {
      closePopup();
    }
  });
}

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
