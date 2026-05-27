async function checkout(){

  const response = await fetch("http://localhost:3000/api/orders",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      user_id:1,
      total:15000,
      preorder_charge_total:5000,
      payment_method:"midtrans",
      payment_status:"pending",
      order_status:"menunggu pembayaran"
    })
  });

  const data = await response.json();

  alert("Order berhasil dibuat");
  window.location.href = data.redirect_url;
}