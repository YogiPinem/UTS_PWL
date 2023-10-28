import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./App.css"; // Menghubungkan file CSS

function DataProduk({ onAddProduct }) {
  const history = useHistory();
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      id: Math.floor(Math.random() * 1000), // ID unik sementara
      ...productData,
    };
    onAddProduct(newProduct);
    setProductData({
      name: "",
      price: "",
      description: "",
    });
    history.push("/");
  };

  return (
    <div className="product-form-container">
      <h2 className="product-form-title">Tambah Produk Baru</h2>
      <form className="product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={productData.name}
          onChange={handleChange}
          placeholder="Nama Produk"
        />
        <input
          type="text"
          name="price"
          value={productData.price}
          onChange={handleChange}
          placeholder="Harga Produk"
        />
        <textarea
          name="description"
          value={productData.description}
          onChange={handleChange}
          placeholder="Deskripsi Produk"
        />
        <button type="submit">Simpan</button>
      </form>
    </div>
  );
}

export default DataProduk;