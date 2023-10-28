import React from "react";
import "./App.css"; 

function DaftarProduk({ products, onDeleteProduct, onAddToCart }) {
  const handleDelete = (productId) => {
    onDeleteProduct(productId);
  };

  const handleAddToCart = (product) => {
    onAddToCart(product);
  };

  return (
    <div className="product-list-container">
      <h1 className="product-list-title">Toko Emir</h1>
      <h2 className="product-list-title">Daftar Produk</h2>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <h2>{product.name}</h2>
            <p>Harga: {product.price}</p>
            <p>{product.description}</p>
            <button onClick={() => handleDelete(product.id)}>Hapus</button>
            <button onClick={() => handleAddToCart(product)}>Tambah ke Keranjang</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DaftarProduk;