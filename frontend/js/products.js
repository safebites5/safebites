function addToCart(id,name,price){

    let cart =
    JSON.parse(localStorage.getItem("cart"))
    || [];

    const existingProduct =
    cart.find(item => item.id === id);

    if(existingProduct){

        existingProduct.qty += 1;

    }else{

        cart.push({
            id,
            name,
            price,
            qty:1
        });

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert("Produk masuk keranjang");

}