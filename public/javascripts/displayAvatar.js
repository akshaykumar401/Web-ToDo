function uploadImage(){
  const display = document.querySelector(".avatarSample")
  const getAvatar = document.getElementById("avatar")

  display.src = URL.createObjectURL(getAvatar.files[0]);
  display.style.display = "flex"
}