let allProducts = [];

// ====================================
// GET PRODUCTS
// ====================================

async function getProducts(){

    try{

        const response = await fetch(
            "http://localhost:3000/api/products"
        );

        const products =
        await response.json();

        // SAVE PRODUCTS
        allProducts = products;

        // RENDER
        renderProducts(products);

    }catch(error){

        console.log(error);

    }

}

// ====================================
// RENDER PRODUCTS
// ====================================

function renderProducts(products){

    let html = "";

    // EMPTY PRODUCT
    if(products.length === 0){

        html = `

        <div class="empty-product">

            <h2>
                Produk tidak ditemukan
            </h2>

        </div>

        `;

        document.getElementById(
            "product-list"
        ).innerHTML = html;

        return;

    }

    // LOOP PRODUCTS
    products.forEach(product => {

        html += `
        
        <div class="card">

            <!-- DETAIL CLICK -->
            <div
                onclick="
                goToDetail(${product.id})
                "
                style="
                    cursor:pointer;
                    height:100%;
                    display:flex;
                    flex-direction:column;
                "
            >

                <!-- IMAGE -->
                <img 
                    src="
                    http://localhost:3000/uploads/${product.image}
                    "
                    alt="${product.name}"
                >

                <!-- CART ICON -->
                <div class="cart-icon">
                    🛒
                </div>

                <!-- BODY -->
                <div class="card-body">

                    <!-- PRODUCT NAME -->
                    <h3>

                        ${product.name}

                    </h3>

                    <!-- CATEGORY -->
                    <p class="eta">

                        Category :
                        ${product.category || '-'}

                    </p>

                    <!-- DESCRIPTION -->
                    <p class="eta">

                        ${
                            product.description
                            ? product.description.substring(0,70)
                            : 'No Description'
                        }...

                    </p>

                    <!-- PICKUP -->
                    <p class="eta">

                        Pickup :
                        ${
                            product.pickup_date
                            || '-'
                        }

                    </p>

                    <!-- PRICE -->
                    <div class="price">

                        Rp
                        ${Number(
                            product.price
                        ).toLocaleString("id-ID")}

                    </div>

                    <!-- BUTTON -->
                    <button
                        onclick="
                        addToCart(
                            event,
                            ${product.id},
                            '${product.name}',
                            ${product.price},
                            '${product.image}'
                        )
                        "
                    >

                        Pre Order

                    </button>

                </div>

            </div>

        </div>
        
        `;

    });

    // SHOW PRODUCT
    document.getElementById(
        "product-list"
    ).innerHTML = html;

}

// ====================================
// DETAIL PAGE
// ====================================

function goToDetail(id){

    window.location.href =
    "detail.html?id=" + id;

}

// ====================================
// FILTER CATEGORY
// ====================================

function filterCategory(category){

    // ACTIVE BUTTON
    document
    .querySelectorAll(
        ".filter-container button"
    )
    .forEach(button => {

        button.classList.remove(
            "active"
        );

        if(
            button.innerText === category
        ){

            button.classList.add(
                "active"
            );

        }

    });

    // SHOW ALL
    if(category === "Semua"){

        renderProducts(allProducts);

        return;

    }

    // FILTER PRODUCT
    const filteredProducts =
    allProducts.filter(product =>

        product.category
        ?.toLowerCase()
        ===
        category.toLowerCase()

    );

    renderProducts(filteredProducts);

}

// ====================================
// SEARCH PRODUCT
// ====================================

function searchProduct(){

    const keyword =
    document.getElementById(
        "search-input"
    )
    .value
    .toLowerCase();

    // FILTER
    const filteredProducts =
    allProducts.filter(product =>

        product.name
        ?.toLowerCase()
        .includes(keyword)

    );

    renderProducts(filteredProducts);

}

// ====================================
// ADD TO CART
// ====================================

function addToCart(
    event,
    id,
    name,
    price,
    image
){

    // STOP DETAIL CLICK
    event.stopPropagation();

    // GET CART
    let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    // CHECK PRODUCT
    const existingProduct =
    cart.find(item => item.id === id);

    // IF EXIST
    if(existingProduct){

        existingProduct.qty += 1;

    }else{

        // ADD PRODUCT
        cart.push({

            id:id,
            name:name,
            price:price,
            image:image,
            qty:1

        });

    }

    // SAVE
    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );

    alert(
        "Produk masuk keranjang"
    );

}

// ====================================
// LOAD PRODUCTS
// ====================================

getProducts();