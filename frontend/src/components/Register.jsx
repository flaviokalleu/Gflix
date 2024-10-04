import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [user, setUser] = useState({
    username: "", // Alterado de "name" para "username"
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      alert("As senhas não correspondem.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/register`,
        user
      );
      alert("Usuário registrado com sucesso");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Erro ao registrar o usuário";
      alert(errorMessage);
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
        <h2 className="text-white text-3xl font-bold text-center">Registrar</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="username" // Alterado para "username"
              placeholder="Nome de usuário"
              value={user.username}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={user.password}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar Senha"
              value={user.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            Registrar
          </button>
        </form>
        <p className="text-gray-500 text-center">
          Já tem uma conta?{" "}
          <a href="/login" className="text-red-600">
            Faça login.
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
