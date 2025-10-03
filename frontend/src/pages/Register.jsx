import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/users/register", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input type="text" name="name"
          placeholder="Name"
          onChange={handleChange}
          value={formData.name} required
          className="w-full p-2 border rounded-lg mb-4" />
        <input type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email} required
          className="w-full p-2 border rounded-lg mb-4" />
        <input type="text"
          name="mobile" placeholder="Mobile"
          onChange={handleChange}
          value={formData.mobile} required
          className="w-full p-2 border rounded-lg mb-4" />
        <input type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password} required
          className="w-full p-2 border rounded-lg mb-4" />

        <select name="role" onChange={handleChange} value={formData.role} className="w-full p-2 border rounded-lg mb-4">
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
        </select>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Register</button>
      </form>
    </div>
  );
}

export default Register;
