const button = document.querySelector(".add");
const form = document.querySelector(".addTodo-form");

button.addEventListener("click", (e) => {
  e.preventDefault();

  if(form.style.display === "block") {
    form.style.display = "none";
  } else {
    form.style.display = "block";
  }
})