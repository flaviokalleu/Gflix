import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importar useNavigate

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // Inicializar useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/login`,
        credentials
      );

      // Armazenar o token no localStorage
      localStorage.setItem("token", response.data.token);

      // Verificar o papel do usuário na resposta
      const role = response.data.role; // Certifique-se de que o papel do usuário está na resposta

      // Redirecionar para o dashboard correspondente
      if (role === "admin") {
        navigate("/admin/dashboard"); // Redirecionar para o dashboard do administrador
      } else {
        navigate("/dashboarduser"); // Redirecionar para o dashboard do usuário
      }

      alert("Login successful");
    } catch (error) {
      alert("Login failed");
      console.error(error);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{
        backgroundImage:
          "url('https://c4.wallpaperflare.com/wallpaper/848/927/678/minimalism-texture-black-background-black-armor-wallpaper-preview.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-opacity-80 bg-gray-900 p-8 rounded-lg max-w-md w-full space-y-6">
        <h2 className="text-white text-3xl font-bold text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={credentials.email}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            Login
          </button>
        </form>
        <p className="text-gray-500 text-center">
          Novo por aqui?{" "}
          <a href="/register" className="text-red-600">
            Assine agora.
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
