import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Products from "./pages/Products";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1 className="p-6">Home Page</h1>} />
        <Route path="/categories" element={<h1 className="p-6">Categories Page</h1>} />
        <Route path="/charity" element={<h1 className="p-6">Charity Page</h1>} />
        <Route path="/dashboard" element={<h1 className="p-6">Admin Dashboard</h1>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </Router>
  );
}

export default App;
