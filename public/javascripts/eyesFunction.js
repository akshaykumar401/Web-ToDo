const change = (id) => {
  const eye = document.querySelectorAll(".eye");
  const password = document.querySelectorAll(".password");

  if (id === 0) {
    if (password[0].type === "password") {
      password[0].type = "text"
      eye[0].className = "fa-solid fa-eye-slash eye"
    } else {
      password[0].type = "password"
      eye[0].className = "fa-regular fa-eye eye"
    }
  } else {
    if (password[1].type === "password") {
      password[1].type = "text"
      eye[1].className = "fa-solid fa-eye-slash eye"
    } else {
      password[1].type = "password"
      eye[1].className = "fa-regular fa-eye eye"
    }
  }
}