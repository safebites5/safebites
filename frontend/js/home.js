const products = [
  {
    id: 1,
    name: "Cream",
    price: "Rp 15.000",
    image: "./asset/images/Cream.jpg"
  },

  {
    id: 2,
    name: "Chocolate Bread",
    price: "Rp 18.000",
    image: "./asset/images/Eclair.jpg"
  },

  {
    id: 3,
    name: "Croissant",
    price: "Rp 20.000",
    image: "./asset/images/Bento.jpg"
  },

  {
    id: 4,
    name: "Donut",
    price: "Rp 12.000",
    image: "./asset/images/Bento.jpg"
  }
];

const productList = document.getElementById("product-list");

products.forEach(product => {

  productList.innerHTML += `

    <div class="card">

      <img src="${product.image}" alt="${product.name}">

      <div class="card-body">

        <h3>${product.name}</h3>

        <p class="harga">
          ${product.price}
        </p>

        <p class="eta">
          Fresh Everyday
        </p>

        <button>
          Tambah ke Keranjang
        </button>

      </div>

    </div>

  `;

});