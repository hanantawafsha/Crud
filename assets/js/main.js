const name = document.querySelector("#productName");
const category = document.querySelector("#productCategory");
const price = document.querySelector("#productPrice");
const description = document.querySelector("#productDescription");
const addButton = document.querySelector("#click");

let invalidName = document.querySelector(".invalidName");
let invalidCategory = document.querySelector(".invalidCategory");
let invalidPrice = document.querySelector(".invalidPrice");
let invalidDescription = document.querySelector(".invalidDescription");

let products = [];
// Retrieve data from local storage
if (localStorage.getItem("products") != null) {
  products = JSON.parse(localStorage.getItem("products"));
  displayProducts();
}

addButton.addEventListener("click", (e) => {
  e.preventDefault();
  // Name pattern: starts with a capital letter, followed by at least 4 lowercase letters
  const namePattern = /^[A-Z][a-z]{2,}[0-9]$/;

  // Category pattern: starts with a capital letter, followed by at least 4 lowercase letters
  const categoryPattern = /^[A-Z][a-z]{4,}$/;

  // Price pattern: a number between 10 and 999 (no decimals)
  const pricePattern = /^\d{2,3}$/;

  // Description pattern: starts with a capital letter and at least 5 lowercase letters
  const descriptionPattern = /^[A-Z][a-z]{6,}$/;
  let isValid = true;
  if (!namePattern.test(name.value)) {
    invalidName.innerHTML =
      "this field is required and should start with a capital letter, followed by at least 2 lowercase letters and number.";
    name.classList.add("is-invalid");
    isValid = false;
  }
  if (!categoryPattern.test(category.value)) {
    invalidCategory.innerHTML =
    "this field is required and should start with a capital letter, followed by at least 4 lowercase letters.";
    category.classList.add("is-invalid");
    isValid = false;
  }
  if (!pricePattern.test(price.value)) {
    invalidPrice.innerHTML =
      "this field is required and it should be a number between 10 and 999 (no decimals).";
    price.classList.add("is-invalid");
    isValid = false;
  }

  if (!descriptionPattern.test(description.value)) {
    invalidDescription.innerHTML =
    "this field is required and should start with a capital letter, followed by at least 6 lowercase letters.";
    description.classList.add("is-invalid");
    isValid = false;
  }
  if (isValid) {
    const newProduct = {
      name: name.value,
      category: category.value,
      price: parseFloat(price.value),
      description: description.value,
    };
    products.push(newProduct);
    console.log(products);
    localStorage.setItem("products", JSON.stringify(products));
    //   display toaste after adding new product
    Swal.fire({
      icon: "success",
      title: "Product added successfully!",
      text: "New product has been added to the list.",
    });
    displayProducts();
    // Clear validation messages and set valid classes
    invalidName.innerHTML = "";
    name.classList.remove("is-invalid");
    name.classList.add("is-valid");

    invalidCategory.innerHTML = "";
    category.classList.remove("is-invalid");
    category.classList.add("is-valid");

    invalidDescription.innerHTML = "";
    description.classList.remove("is-invalid");
    description.classList.add("is-valid");

    invalidPrice.innerHTML = "";
    price.classList.remove("is-invalid");
    price.classList.add("is-valid");
  } else {
    // show error message
    Swal.fire({
      icon: "error",
      title: "Invalid input!",
      text: "Please make sure all fields are filled correctly.",
    });
  }
});

// Function to display products
function displayProducts(filteredProducts = null) {
  document.querySelector("#data").innerHTML = ``;
  const productsToDisplay = filteredProducts || products;

  const resutl = productsToDisplay
    .map((product, index) => {
      return `
        <tr> 
    <td> ${index + 1}</td>
    <td> ${product.name}</td>
    <td> ${product.category}</td>
    <td> ${product.price}</td>
    <td> ${product.description}</td>
    <td> <button class="btn btn-outline-danger" onclick="deleteProduct(${index})">Delete</button></td> 
    <td> <button class="btn btn-outline-primary" onclick="updateProduct(${index})">Update</button></td>
          
        </tr>`;
    })
    .join(" ");
  document.querySelector("#data").innerHTML = resutl;
}

// Function to delete a product

function deleteProduct(index) {
  //display toaste to delete a product
  Swal.fire({
    title: "Delete Product?",
    text: "Are you sure you want to delete this product?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
  }).then((result) => {
    if (result.isConfirmed) {
      console.log("Confirmed: Product deleted.");
      products.splice(index, 1);
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
        title: "the selected product was deleted successfully",
      });
      displayProducts();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      console.log("Cancelled: Product deletion canceled.");
    }
  });
  displayProducts();
}

// Function to update a product

function updateProduct(index) {
  // Get the product to update
  const product = products[index];
  // Print product to the console
  console.log(product);

  // Populate the modal form fields with the product's current data
  document.getElementById("updateProductName").value = product.name;
  console.log(document.getElementById("updateProductName").value);
  document.getElementById("updateProductCategory").value = product.category;
  console.log(document.getElementById("updateProductCategory").value);
  document.getElementById("updateProductPrice").value = product.price;
  console.log(document.getElementById("updateProductPrice").value);
  document.getElementById("updateProductDescription").value =
    product.description;
  console.log(document.getElementById("updateProductDescription").value);

  // Show the Bootstrap modal
  var modal = new bootstrap.Modal(
    document.getElementById("updateProductModal")
  );
  modal.show();

  // Handle saving changes
  document.getElementById("saveChangesButton").onclick = () => {
    // Update the product object
    product.name = document.getElementById("updateProductName").value;
    product.category = document.getElementById("updateProductCategory").value;
    product.price = parseFloat(
      document.getElementById("updateProductPrice").value
    );
    product.description = document.getElementById(
      "updateProductDescription"
    ).value;

    // Save to localStorage
    localStorage.setItem("products", JSON.stringify(products));

    // Display success message
    Swal.fire({
      icon: "success",
      title: "Product updated successfully!",
      text: "The selected product has been updated.",
    });

    // Refresh the product list
    displayProducts();

    // Close the Bootstrap modal
    modal.hide();
  };
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

// Function to handle the search input
// Search event listener
document.getElementById("search").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  console.log("Search query:", query); // Debug: log the search query

  // Filter products based on the search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.price.toString().toLowerCase().includes(query) // Convert price to string
  );

  console.log("Filtered products:", filteredProducts); // Debug: log the filtered results

  // Display filtered products
  displayProducts(filteredProducts);
});
