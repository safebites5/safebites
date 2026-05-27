const params =
new URLSearchParams(
    window.location.search
);

const id = params.get("id");

let quantity = 1;

// ====================================
// GET DETAIL PRODUCT
// ====================================

async function getDetail(){

    try{

        const response = await fetch(
            "http://localhost:3000/api/products"
        );

        const products =
        await response.json();

        const product =
        products.find(p => p.id == id);

        let html = `

        <!-- LEFT -->
        <div class="product-gallery">

            <!-- MAIN IMAGE -->
            <div class="main-image">

                <img 
                    id="main-product-image"
                    src="
                    http://localhost:3000/uploads/${product.image}
                    "
                    alt="${product.name}"
                >

            </div>

            <!-- THUMBNAIL RANDOM -->
            <div class="thumbnail-container">

                ${products

                    .filter(p => p.id != product.id)

                    .slice(0,3)

                    .map(other => `

                        <div class="thumbnail">

                            <img 
                                onclick="
                                window.location.href='detail.html?id=${other.id}'
                                "
                                src="
                                http://localhost:3000/uploads/${other.image}
                                "
                                alt="${other.name}"
                            >

                        </div>

                    `).join("")

                }

            </div>

        </div>

        <!-- RIGHT -->
        <div class="product-info">

            <h1>
                ${product.name}
            </h1>

            <p class="price">
                Rp ${product.price}
            </p>

            <p class="description">
                ${product.description}
            </p>

            <!-- INFO -->
            <div class="info-container">

                <div class="info-box">

                    <div class="icon">
                        📦
                    </div>

                    <div class="info-text">

                        <h4>
                            Category
                        </h4>

                        <p>
                            ${product.category}
                        </p>

                    </div>

                </div>

                <div class="info-box">

                    <div class="icon">
                        🛒
                    </div>

                    <div class="info-text">

                        <h4>
                            Pre Order Limit
                        </h4>

                        <p>
                            ${product.preorder_limit}
                        </p>

                    </div>

                </div>

            </div>

            <!-- INFO -->
            <div class="info-container">

                <div class="info-box">

                    <div class="icon">
                        📅
                    </div>

                    <div class="info-text">

                        <h4>
                            Pickup Date
                        </h4>

                        <p>
                            ${product.pickup_date || '-'}
                        </p>

                    </div>

                </div>

                <div class="info-box">

                    <div class="icon">
                        💰
                    </div>

                    <div class="info-text">

                        <h4>
                            Pre Order Charge
                        </h4>

                        <p>
                            Rp 2.500
                        </p>

                    </div>

                </div>

            </div>

            <!-- NOTE -->
            <p class="description">

                ${product.preorder_note || '-'}

            </p>

            <!-- QUANTITY -->
            <h3 class="quantity-title">

                Kuantitas

            </h3>

            <div class="quantity-box">

                <button onclick="decreaseQty()">
                    -
                </button>

                <span id="qty">
                    1
                </span>

                <button onclick="increaseQty()">
                    +
                </button>

            </div>

            <!-- BUTTON -->
            <div class="button-group">

                <button
                    onclick="addToCart(
                        ${product.id},
                        '${product.name}',
                        ${product.price},
                        '${product.image}'
                    )"
                    class="checkout-btn"
                >

                    🛍️ Pre Order Sekarang

                </button>

                <button
                    onclick="addToCart(
                        ${product.id},
                        '${product.name}',
                        ${product.price},
                        '${product.image}'
                    )"
                    class="cart-btn"
                >

                    🛒 Masukkan Keranjang

                </button>

            </div>

        </div>

        `;

        document.getElementById(
            "product-detail"
        ).innerHTML = html;

    }catch(error){

        console.log(error);

    }

}

// ====================================
// INCREASE QTY
// ====================================

function increaseQty(){

    quantity++;

    document.getElementById(
        "qty"
    ).innerHTML = quantity;

}

// ====================================
// DECREASE QTY
// ====================================

function decreaseQty(){

    if(quantity > 1){

        quantity--;

    }

    document.getElementById(
        "qty"
    ).innerHTML = quantity;

}

// ====================================
// ADD TO CART
// ====================================

function addToCart(
    id,
    name,
    price,
    image
){

    let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const existingProduct =
    cart.find(item => item.id === id);

    if(existingProduct){

        existingProduct.qty += quantity;

    }else{

        cart.push({

            id,
            name,
            price,
            image,
            qty:quantity

        });

    }

    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );

    alert(
        "Produk masuk keranjang"
    );

    window.location.href =
    "cart.html";

}

// ====================================
// LOAD DETAIL
// ====================================

getDetail();