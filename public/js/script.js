//Show Alert
const showAlert = document.querySelector("[show-alert]");

if (showAlert) {
  const time = showAlert.getAttribute('data-time');
  const closeAlert = document.querySelector('[close-alert]');
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time)

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  })
}

//End Show Alert

//Upload Image
const uploadImage = document.querySelector('[upload-image]');
if (uploadImage) {
  const uploadImageInput = document.querySelector('[upload-image-input]');
  const uploadImagePreview = document.querySelector('[upload-image-preview ]');
  uploadImageInput.addEventListener("change", (e) => {
    const [file] = e.target.files;
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  })
  const buttonDeleteImage = document.querySelector('[delete-image]');
  if (buttonDeleteImage) {
    buttonDeleteImage.addEventListener("click", (e) => {
      e.preventDefault();
      uploadImageInput.value = "";
      uploadImagePreview.src = "";
    })
  }
}
//End upload image
