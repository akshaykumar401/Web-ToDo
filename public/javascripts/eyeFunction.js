const eye = document.querySelector("#eye");
const password = document.querySelector(".password");

eye.addEventListener("click", (e) => {
  e.preventDefault();

  if(password.type === "password") {
    password.type = "text";
    eye.classList = "fa-solid fa-eye-slash";
  } else {
    password.type = "password";
    eye.classList = "fa-solid fa-eye";
  }
})