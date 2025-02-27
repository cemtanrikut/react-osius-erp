import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Örnek giriş kontrolü
    if (email === "admin@osius.nl" && password === "admin") {
      navigate("/dashboard");
    } else {
      alert("Hatalı giriş! Lütfen bilgilerinizi kontrol edin.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 flex flex-col items-center">
        
        {/* Osius Logo */}
        <img src="/osius_logo.png" alt="Osius Logo" className="h-16 mb-6" />

        {/* Başlık */}
        <h2 className="text-2xl font-bold mb-4 text-center">CRM Login</h2>

        {/* Giriş Formu */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
