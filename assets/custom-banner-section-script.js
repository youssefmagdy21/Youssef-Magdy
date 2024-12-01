// mobile nav menu
const navIcon = document.querySelector("#nav-icon");
const openNavIcon = document.querySelector("#open-nav");
const closeNavIcon = document.querySelector("#close-nav");
const navMenu = document.querySelector("#nav-menu");

navIcon.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  closeNavIcon.classList.toggle("active");
  openNavIcon.classList.toggle("active");
});
