import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ userId: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/users/login", credentials);
      login({
        token: res.data.token,
        role: res.data.role,
        email: res.data.email,
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input type="text" name="userId" placeholder="Email or Mobile" onChange={handleChange} value={credentials.userId} required className="w-full p-2 border rounded-lg mb-4" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} value={credentials.password} required className="w-full p-2 border rounded-lg mb-4" />

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">Login</button>
      </form>
    </div>
  );
}

export default Login;
