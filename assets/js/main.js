const name = document.querySelector("#productName");
const category = document.querySelector("#productCategory");
const price = document.querySelector("#productPrice");
const description = document.querySelector("#productDescription");
const addButton = document.querySelector("#click");

let products = [];

// Retrieve data from local storage
if (localStorage.getItem("products") != null) {
  products = JSON.parse(localStorage.getItem("products"));
  displayProducts();
}

addButton.addEventListener("click", (e) => {
  e.preventDefault();
  const newProduct = {
    name: name.value,
    category: category.value,
    price: parseFloat(price.value),
    description: description.value,
  };
  products.push(newProduct);
  console.log(products);
  localStorage.setItem("products", JSON.stringify(products));
  displayProducts();
});

// Function to display products
function displayProducts() {
  const resutl = products
    .map((product, index) => {
      return `
        <tr> 
    <td> ${index}</td>
    <td> ${product.name}</td>
    <td> ${product.category}</td>
    <td> ${product.price}</td>
    <td> ${product.description}</td>

        </tr>`;
    })
    .join(" ");
  document.querySelector("#data").innerHTML = resutl;
}

// function to delete all products

function deleteAllProducts() {
  // check if there is a product
  if (localStorage.getItem("products") == null || products.length == 0) {
    // display toaste
    Swal.fire({
      icon: "error",
      title: "No products to delete!",
      text: "No products found in the local storage.",
    });
  } else {
    Swal.fire({
      title: "Delete All Products!",
      text: "Are you sure you want to delete all products?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Confirmed: Products deleted.");
        products = [];
        localStorage.setItem("products", JSON.stringify(products));
        // display toaste
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "All products were deleted successfully",
        });
        displayProducts();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("Cancelled: No action taken.");
      }
    });
  }
}
