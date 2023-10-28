import React, { useState } from "react";
import { BrowserRouter as Switch, Router, Route, Link, useHistory } from "react-router-dom";
import DaftarProduk from "./DaftarProduk";
import DataProduk from "./TambahProduk";
import Keranjang from "./Keranjang";
import "./App.css";  
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // 


function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null);

  const addProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const deleteProduct = (productId) => {
    const updatedProducts = products.filter((product) => product.id !== productId);
    setProducts(updatedProducts);
  };

  const addToCart = (product) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find((item) => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({ product, quantity: 1 });
    }

    setCart(updatedCart);
  };

  const checkout = () => {
    setCart([]); // Reset keranjang
    toast.success("Pesanan berhasil dipesan!"); // Menampilkan notifikasi sukses
    setTimeout(() => {
      setOrder(null); // Hapus pesan setelah beberapa detik
    }, 3000);
  };
  

  return (
    <Router>
      <div>
        <nav>
        <ul>
          <li>
            <Link to="/" className="nav-link">Beranda</Link>
          </li>
          <li>
            <Link to="/tambah-produk" className="nav-link">Tambah Produk</Link>
          </li>
          <li>
            <Link to="/keranjang" className="nav-link">Keranjang</Link>
          </li>
        </ul>
      </nav>

        <Switch>
          <Route path="/tambah-produk">
            <DataProduk onAddProduct={addProduct} />
          </Route>
          <Route path="/keranjang">
            <Keranjang cart={cart} onCheckout={checkout} />
            {order && <p>{order}</p>}
          </Route>
          <Route path="/">
            <DaftarProduk
              products={products}
              onDeleteProduct={deleteProduct}
              onAddToCart={addToCart}
            />
          </Route>
        </Switch>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;