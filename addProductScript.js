let db;
const request = indexedDB.open("ProductDB", 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;
    const objectStore = db.createObjectStore("products", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("name", "name", { unique: false });
    objectStore.createIndex("price", "price", { unique: false });
    objectStore.createIndex("toyType", "toyType", { unique: false });
    objectStore.createIndex("toyImage", "toyImage", { unique: false });
};

request.onsuccess = function (event) {
    db = event.target.result;
};

request.onerror = function (event) {
    console.error("Database error:", event.target.errorCode);
};

function handleSubmitForAddProduct(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const price = parseFloat(document.getElementById("price").value);
    const toyType = document.getElementById("toyType").value;
    const toyImage = document.getElementById("toyImage").files[0];
    const allowedImageTypes = ['image/jpeg', 'image/jpg'];

    if (!name) {
        alert('Please enter the product name.');
        return;
    }

    if (!price || isNaN(price) || price <= 0) {
        alert('Please enter a valid price greater than 0.');
        return;
    }

    if (!toyType) {
        alert('Please select a type of toy.');
        return;
    }

    if (!toyImage) {
        alert('Please upload an image of the toy.');
        return;
    }

    if (!allowedImageTypes.includes(toyImage.type)) {
        alert('Please upload a valid image file (JPEG or JPG).');
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        const imageUrl = event.target.result;

        const newProduct = {
            name: name,
            price: price,
            toyType: toyType,
            toyImage: imageUrl
        };

        const transaction = db.transaction(["products"], "readwrite");
        const objectStore = transaction.objectStore("products");
        const request = objectStore.add(newProduct);

        request.onsuccess = function () {
            const successMessage = document.getElementById("successMessage");
            successMessage.textContent = "Product Added Successfully!";
            successMessage.style.display = "block";
            document.getElementById("addProduct").reset();
            setTimeout(function () {
                successMessage.style.display = "none";
            }, 2000);
            displayProducts();
        };

        request.onerror = function () {
            console.error("Error adding product:", request.error);
        };
    };
    reader.readAsDataURL(toyImage);
};


const req = indexedDB.open("ProductDB", 1);

req.onsuccess = function (event) {
    db = event.target.result;
    displayProducts();
};

request.onerror = function (event) {
    console.error("Database error:", event.target.errorCode);
};

function displayProducts() {
    const transaction = db.transaction(["products"], "readonly");
    const objectStore = transaction.objectStore("products");
    const request = objectStore.getAll();

    request.onsuccess = function (event) {
        const products = event.target.result;
        const productList = document.getElementById("productList");
        productList.innerHTML = "";

        products.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.className = "product";

            productDiv.innerHTML = `
                <article class="card">
                    <img src="${product.toyImage}" alt="${product.name}" />
                    <p class="product-title">${product.name}</p>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <p class="product-type">Type: ${product.toyType}</p>
                </article>
            `;
            productList.appendChild(productDiv);
        });
    };

    request.onerror = function (event) {
        console.error("Error retrieving products:", request.error);
    };
}
