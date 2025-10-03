import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          E-Commerce
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <Link to="/categories" className="hover:text-blue-600">Categories</Link>

          {/* Only Admins & Super Admins */}
          {user?.role === "admin" || user?.role === "superadmin" ? (
            <>
              <Link to="/charity" className="hover:text-blue-600">Charity</Link>
              <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            </>
          ) : null}
        </div>

        {/* Right side */}
        <div className="hidden md:flex space-x-4">
          {user ? (
            <>
              <span className="text-gray-600">Hi, {user.email}</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Register</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg p-4 space-y-4">
          <Link to="/" className="block hover:text-blue-600">Home</Link>
          <Link to="/products" className="block hover:text-blue-600">Products</Link>
          <Link to="/categories" className="block hover:text-blue-600">Categories</Link>

          {user?.role === "admin" || user?.role === "superadmin" ? (
            <>
              <Link to="/charity" className="block hover:text-blue-600">Charity</Link>
              <Link to="/dashboard" className="block hover:text-blue-600">Dashboard</Link>
            </>
          ) : null}

          <hr />
          {user ? (
            <>
              <span className="block text-gray-600">Hi, {user.email}</span>
              <button
                onClick={logout}
                className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block hover:text-blue-600">Login</Link>
              <Link to="/register" className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
