const PRODUCT_API =
"http://localhost:3000/api/products";

const ORDER_API =
"http://localhost:3000/api/admin/orders";

window.editId = null;

// ====================================
// FORMAT RUPIAH
// ====================================

function formatRupiah(number){

    return new Intl.NumberFormat(
        "id-ID"
    ).format(number);

}

// ====================================
// TOAST
// ====================================

function showToast(message,type="success"){

    const toast =
    document.createElement("div");

    toast.className =
    `toast ${type}`;

    toast.innerHTML =
    message;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add("show");

    },100);

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>{

            toast.remove();

        },300);

    },2500);

}

// ====================================
// LOADING
// ====================================

function showLoading(target){

    document.getElementById(target).innerHTML =

    `
    <div class="loading-box">

        Loading...

    </div>
    `;

}

// ====================================
// GET PRODUCTS
// ====================================

async function getProducts(){

    showLoading("product-list");

    try{

        const response =
        await fetch(PRODUCT_API);

        const products =
        await response.json();

        // TOTAL

        document.getElementById(
            "total-products"
        ).innerHTML =
        products.length;

        let html = "";

        // EMPTY

        if(products.length === 0){

            html =

            `
            <div class="empty-state">

                Belum ada produk

            </div>
            `;

        }else{

            products.forEach(product => {

                html +=

                `
                <div class="product-card">

                    <!-- IMAGE -->

                    <div class="product-image">

                        <img
                        src="
                        http://localhost:3000/uploads/${product.image}
                        ">

                        <span class="product-badge">

                            ${product.category}

                        </span>

                    </div>

                    <!-- BODY -->

                    <div class="product-body">

                        <div class="product-top">

                            <h3>

                                ${product.name}

                            </h3>

                        </div>

                        <p class="product-description">

                            ${product.description}

                        </p>

                        <div class="product-bottom">

                            <h2>

                                Rp
                                ${formatRupiah(product.price)}

                            </h2>

                            <span>

                                Limit :
                                ${product.preorder_limit}

                            </span>

                        </div>

                        <!-- ACTION -->

                        <div class="product-actions">

                            <button
                            class="edit-btn"

                            onclick='editProduct(
                            ${JSON.stringify(product)}
                            )'>

                                ✏️ Edit

                            </button>

                            <button
                            class="delete-btn"

                            onclick="
                            deleteProduct(
                                ${product.id}
                            )
                            ">

                                🗑 Hapus

                            </button>

                        </div>

                    </div>

                </div>
                `;

            });

        }

        document.getElementById(
            "product-list"
        ).innerHTML =
        html;

    }catch(error){

        console.log(error);

    }

}

// ====================================
// ADD PRODUCT
// ====================================

async function addProduct(){

    // EDIT MODE

    if(window.editId){

        updateProduct();

        return;

    }

    // VALIDATION

    if(

        document.getElementById("name").value === "" ||

        document.getElementById("price").value === ""

    ){

        showToast(
            "Nama & harga wajib diisi",
            "error"
        );

        return;

    }

    // FORM DATA

    const formData =
    new FormData();

    formData.append(
        "name",
        document.getElementById("name").value
    );

    formData.append(
        "description",
        document.getElementById("description").value
    );

    formData.append(
        "price",
        document.getElementById("price").value
    );

    formData.append(
        "preorder_limit",
        document.getElementById("preorder_limit").value
    );

    formData.append(
        "category",
        document.getElementById("category").value
    );

    formData.append(
        "image",
        document.getElementById("image").files[0]
    );

    try{

        await fetch(PRODUCT_API,{

            method:"POST",

            body:formData

        });

        showToast(
            "Produk berhasil ditambahkan"
        );

        resetForm();

        getProducts();

    }catch(error){

        console.log(error);

    }

}

// ====================================
// EDIT PRODUCT
// ====================================

function editProduct(product){

    window.scrollTo({

        top:0,
        behavior:"smooth"

    });

    document.getElementById("name").value =
    product.name;

    document.getElementById("description").value =
    product.description;

    document.getElementById("price").value =
    product.price;

    document.getElementById("preorder_limit").value =
    product.preorder_limit;

    document.getElementById("category").value =
    product.category;

    window.editId =
    product.id;

    document.querySelector(
        ".submit-btn"
    ).innerHTML =

    "Update Produk";

    showToast(
        "Mode edit aktif"
    );

}

// ====================================
// UPDATE PRODUCT
// ====================================

async function updateProduct(){

    const formData =
    new FormData();

    formData.append(
        "name",
        document.getElementById("name").value
    );

    formData.append(
        "description",
        document.getElementById("description").value
    );

    formData.append(
        "price",
        document.getElementById("price").value
    );

    formData.append(
        "preorder_limit",
        document.getElementById("preorder_limit").value
    );

    formData.append(
        "category",
        document.getElementById("category").value
    );

    const imageInput =
    document.getElementById("image");

    if(imageInput.files[0]){

        formData.append(
            "image",
            imageInput.files[0]
        );

    }

    try{

        await fetch(

            PRODUCT_API +
            "/" +
            window.editId,

            {

                method:"PUT",

                body:formData

            }

        );

        showToast(
            "Produk berhasil diupdate"
        );

        window.editId = null;

        resetForm();

        getProducts();

    }catch(error){

        console.log(error);

    }

}

// ====================================
// DELETE PRODUCT
// ====================================

async function deleteProduct(id){

    try{

        const confirmDelete =
        confirm(
            "Yakin ingin menghapus produk?"
        );

        if(!confirmDelete){

            return;

        }

        await fetch(

            PRODUCT_API + "/" + id,

            {

                method:"DELETE"

            }

        );

        showToast(
            "Produk berhasil dihapus"
        );

        getProducts();

    }catch(error){

        console.log(error);

    }

}

// ====================================
// RESET FORM
// ====================================

function resetForm(){

    document.getElementById("name").value = "";

    document.getElementById("description").value = "";

    document.getElementById("price").value = "";

    document.getElementById("preorder_limit").value = "";

    document.getElementById("category").value = "";

    document.getElementById("image").value = "";

    document.querySelector(
        ".submit-btn"
    ).innerHTML =

    "Simpan Produk";

}

// ====================================
// GET ORDERS
// ====================================

async function getOrders(){

    try{

        // LOADING

        document.getElementById(
            "order-list"
        ).innerHTML =

        `
        <tr>

            <td colspan="6">

                Loading orders...

            </td>

        </tr>
        `;

        // FETCH

        const response =
        await fetch(ORDER_API);

        if(!response.ok){

            throw new Error(
                "Gagal fetch orders"
            );

        }

        // JSON

        const orders =
        await response.json();

        console.log(orders);

        // TOTAL ORDER

        document.getElementById(
            "total-order"
        ).innerHTML =
        orders.length;

        // REVENUE

        let revenue = 0;

        orders.forEach(order => {

            revenue += Number(order.total);

        });

        document.getElementById(
            "total-revenue"
        ).innerHTML =

        "Rp " +
        formatRupiah(revenue);

        // ACTIVE ORDER

        const activeOrders =
        orders.filter(order =>

            order.order_status !== "selesai"

        );

        document.getElementById(
            "preorder-active"
        ).innerHTML =
        activeOrders.length;

        // HTML

        let html = "";

        // EMPTY

        if(orders.length === 0){

            html =

            `
            <tr>

                <td colspan="6">

                    Belum ada order

                </td>

            </tr>
            `;

        }else{

            // LOOP

            orders.forEach(order => {

                let statusClass =
                "pending";

                if(

                    order.payment_status ===
                    "paid"

                ){

                    statusClass =
                    "success";

                }

                html +=

                `
                <tr>

                    <!-- ORDER -->

                    <td>

                        <b>

                            ${order.order_code}

                        </b>

                        <br><br>

                        <small>

                            ${order.created_at}

                        </small>

                    </td>

                    <!-- CUSTOMER -->

                    <td>

                        <b>

                            ${order.customer_name || "-"}

                        </b>

                        <br><br>

                        📞 ${order.phone || "-"}

                        <br>

                        📍 ${order.city || "-"}

                        <br>

                        🏠 ${order.address || "-"}

                    </td>

                    <!-- TOTAL -->

                    <td>

                        Rp
                        ${formatRupiah(order.total)}

                    </td>

                    <!-- PAYMENT -->

                    <td>

                        <span class="
                        status
                        ${statusClass}
                        ">

                            ${order.payment_status}

                        </span>

                    </td>

                    <!-- STATUS -->

                    <td>

                        ${order.order_status}

                    </td>

                    <!-- ACTION -->

                    <td>

                        <select
                        class="status-select"

                        onchange="
                        updateStatus(
                            ${order.id},
                            this.value
                        )
                        ">

                            <option>

                                Update

                            </option>

                            <option value="diproses">

                                Diproses

                            </option>

                            <option value="dipanggang">

                                Dipanggang

                            </option>

                            <option value="siap_diambil">

                                Siap Diambil

                            </option>

                            <option value="selesai">

                                Selesai

                            </option>

                        </select>

                    </td>

                </tr>
                `;

            });

        }

        // RENDER

        document.getElementById(
            "order-list"
        ).innerHTML =
        html;

    }catch(error){

        console.log(error);

        document.getElementById(
            "order-list"
        ).innerHTML =

        `
        <tr>

            <td colspan="6">

                Gagal memuat order

            </td>

        </tr>
        `;

    }

}

// ====================================
// UPDATE STATUS
// ====================================

async function updateStatus(id,status){

    if(status === "Update"){

        return;

    }

    try{

        const response =
        await fetch(

            "http://localhost:3000/api/admin/orders/" + id,

            {

                method:"PUT",

                headers:{

                    "Content-Type":
                    "application/json"

                },

                body:JSON.stringify({

                    order_status:status

                })

            }

        );

        const result =
        await response.json();

        console.log(result);

        showToast(
            "Status berhasil diupdate"
        );

        getOrders();

    }catch(error){

        console.log(error);

        showToast(
            "Gagal update status",
            "error"
        );

    }

}

// ====================================
// SEARCH PRODUCT
// ====================================

document.addEventListener(
    "input",
    function(e){

        if(

            e.target.classList.contains(
                "search-box"
            )

        ){

            const keyword =
            e.target.value.toLowerCase();

            const cards =
            document.querySelectorAll(
                ".product-card"
            );

            cards.forEach(card => {

                const title =
                card.innerText.toLowerCase();

                if(title.includes(keyword)){

                    card.style.display =
                    "block";

                }else{

                    card.style.display =
                    "none";

                }

            });

        }

    }
);

// ====================================
// LOAD
// ====================================

getProducts();
getOrders();