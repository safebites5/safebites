let cart =
JSON.parse(localStorage.getItem("cart"))
|| [];

// ====================================
// CHARGE PER ITEM
// ====================================

const preorderCharge = 2500;

// ====================================
// RENDER CART
// ====================================

function renderCart(){

    let html = "";

    let total = 0;

    // EMPTY CART
    if(cart.length === 0){

        html = `

        <h2 style="
            font-family:'Noto Serif',serif;
            color:#725A39;
        ">
            Keranjang kosong
        </h2>

        `;

        document.getElementById(
            "cart-list"
        ).innerHTML = html;

        document.getElementById(
            "total"
        ).innerHTML = "Rp 0";

        return;

    }

    // LOOP CART
    cart.forEach((item,index) => {

        // SUBTOTAL PRODUCT
        const productSubtotal =
        item.price * item.qty;

        // CHARGE
        const chargeTotal =
        preorderCharge * item.qty;

        // FINAL SUBTOTAL
        const subtotal =
        productSubtotal + chargeTotal;

        // TOTAL
        total += subtotal;

        html += `

        <!-- PRODUCT CARD -->
        <div class="product-card">

            <!-- IMAGE -->
            <img 
                src="
                http://localhost:3000/uploads/${item.image}
                "
                alt="${item.name}"
            >

            <!-- DETAIL -->
            <div class="product-detail">

                <h3>
                    ${item.name}
                </h3>

                <p>
                    Harga :
                    Rp ${item.price}
                </p>

                <p>
                    Pre Order Charge :
                    Rp ${preorderCharge}
                </p>

                <!-- QUANTITY -->
                <div style="
                    display:flex;
                    align-items:center;
                    gap:15px;
                    margin-top:15px;
                    margin-bottom:15px;
                ">

                    <button
                        onclick="decreaseQty(${index})"
                        style="
                            width:35px;
                            height:35px;
                            border-radius:8px;
                            background:#725A39;
                            color:white;
                            font-size:18px;
                        "
                    >
                        -
                    </button>

                    <span class="qty">
                        ${item.qty}
                    </span>

                    <button
                        onclick="increaseQty(${index})"
                        style="
                            width:35px;
                            height:35px;
                            border-radius:8px;
                            background:#725A39;
                            color:white;
                            font-size:18px;
                        "
                    >
                        +
                    </button>

                </div>

                <!-- SUBTOTAL -->
                <p>

                    <span>
                        Subtotal :
                    </span>

                    Rp ${subtotal}

                </p>

                <!-- DELETE -->
                <button
                    onclick="removeItem(${index})"
                    style="
                        margin-top:15px;
                        padding:10px 18px;
                        border-radius:10px;
                        background:red;
                        color:white;
                    "
                >

                    Hapus Produk

                </button>

            </div>

        </div>

        `;

    });

    // SHOW CART
    document.getElementById(
        "cart-list"
    ).innerHTML = html;

    // SHOW TOTAL
    document.getElementById(
        "total"
    ).innerHTML =

    "Rp " + total;

}

// ====================================
// TAMBAH QTY
// ====================================

function increaseQty(index){

    cart[index].qty++;

    saveCart();

}

// ====================================
// KURANG QTY
// ====================================

function decreaseQty(index){

    if(cart[index].qty > 1){

        cart[index].qty--;

    }

    saveCart();

}

// ====================================
// HAPUS ITEM
// ====================================

function removeItem(index){

    cart.splice(index,1);

    saveCart();

}

// ====================================
// SAVE CART
// ====================================

function saveCart(){

    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );

    renderCart();

}

// ====================================
// CHECKOUT
// ====================================

async function checkout(){

    const customer_name =
    document.getElementById(
        "customer_name"
    ).value;

    const phone =
    document.getElementById(
        "phone"
    ).value;

    const city =
    document.getElementById(
        "city"
    ).value;

    const address =
    document.getElementById(
        "address"
    ).value;

    // VALIDASI
    if(
        !customer_name ||
        !phone ||
        !city ||
        !address
    ){

        alert(
            "Lengkapi data checkout"
        );

        return;

    }

    // TOTAL
    let total = 0;

    cart.forEach(item => {

        const productSubtotal =
        item.price * item.qty;

        const chargeTotal =
        preorderCharge * item.qty;

        total +=
        productSubtotal + chargeTotal;

    });

    try{

        // CREATE MIDTRANS TOKEN
        const response = await fetch(

            "http://localhost:3000/api/orders",

            {

                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({

                    customer_name,
                    phone,
                    city,
                    address,

                    total,

                    preorder_charge:
                    preorderCharge,

                    items:cart

                })

            }

        );

        const result =
        await response.json();

        console.log(result);

        // MIDTRANS
        if(result.success){

            window.snap.pay(

                result.snap_token,

                {

                    // SUCCESS
                    onSuccess: async function(){

                        // SAVE ORDER
                        await fetch(

                            "http://localhost:3000/api/save-order",

                            {

                                method:"POST",

                                headers:{
                                    "Content-Type":
                                    "application/json"
                                },

                                body:JSON.stringify({

                                    user_id:1,

                                    customer_name,
                                    phone,
                                    city,
                                    address,

                                    total,

                                    preorder_charge:
                                    preorderCharge,

                                    payment_method:
                                    "midtrans",

                                    payment_status:
                                    "paid",

                                    order_status:
                                    "diproses",

                                    order_code:
                                    result.order_code,

                                    items:cart

                                })

                            }

                        );

                        alert(
                            "Pembayaran berhasil"
                        );

                        // CLEAR CART
                        localStorage.removeItem(
                            "cart"
                        );

                        // REDIRECT
                        window.location.href =
                        "menu.html";

                    },

                    // PENDING
                    onPending:function(){

                        alert(
                            "Menunggu pembayaran"
                        );

                    },

                    // ERROR
                    onError:function(){

                        alert(
                            "Pembayaran gagal"
                        );

                    }

                }

            );

        }else{

            alert(
                "Gagal membuat pembayaran"
            );

        }

    }catch(error){

        console.log(error);

        alert(
            "Server error"
        );

    }

}

// ====================================
// LOAD CART
// ====================================

renderCart();