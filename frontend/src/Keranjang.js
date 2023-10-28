import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./App.css"; 

function Keranjang({ cart, onCheckout }) {
  const handleCheckout = () => {
    onCheckout();
  };

  // Fungsi untuk menghitung total harga dari barang di keranjang
  const calculateTotalPrice = () => {
    let totalPrice = 0;
    cart.forEach((item) => {
      const product = item.product;
      totalPrice += product.price * item.quantity;
    });
    return totalPrice;
  };

  return (
    <div className="shopping-cart">
      <h1>Keranjang Belanja</h1>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>
            {item.product.name} - Jumlah: {item.quantity}
            <br></br>
            {item.product.description}
          </li>
        ))}
      </ul>
      <p>Total Harga: Rp.{calculateTotalPrice()}</p>
      <button onClick={handleCheckout}>Pesan</button>
    </div>
  );
}

export default Keranjang;