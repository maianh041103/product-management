const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if (inputsQuantity) {
  inputsQuantity.forEach((input) => {
    input.addEventListener("change", (e) => {
      const quantity = e.target.value;
      const productId = input.getAttribute("data-id");
      window.location.href = `/cart/update/${productId}/${quantity}`;
    })
  })
}