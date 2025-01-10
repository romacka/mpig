import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState(""); // Инициализация состояния для username
  const [password, setPassword] = useState(""); // Инициализация состояния для password

  const handleRegister = async () => {
    console.log("Отправляем данные:", { username, password }); // Логируем данные

    try {
      const response = await axios.post("http://localhost:8000/users/register", {
        username,
        password,
      });
      alert("Registration successful!");
    } catch (error) {
        if (error.response && error.response.status === 400) {
          alert("This username is already taken. Please try another one.");
        } else {
          alert("An error occurred during registration.");
        }
      }
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          console.log("Username обновлено:", e.target.value);
        }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          console.log("Password обновлено:", e.target.value);
        }}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
