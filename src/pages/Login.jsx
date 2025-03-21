import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // 📌 **Özel Admin Girişi**
        if (email === "admin@osius.nl" && password === "admin") {
            // localStorage.setItem("token", "dummy_admin_token");
            localStorage.setItem("userType", "admin");
            localStorage.setItem("name", "Admin");
            localStorage.setItem("id", "ADMIN");
            navigate("/dashboard");
            return;
        }

        try {
            const API_URL = window.location.hostname === "localhost"
                ? "http://localhost:8080"
                : "https://api-osius.up.railway.app";

            // 📌 **Backend'e Giriş Talebi Gönder**
            const response = await fetch("https://api-osius.up.railway.app/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Giriş başarısız!");
            }

            // // 📌 **JWT Token ve Kullanıcı Tipini Kaydet**
            // localStorage.setItem("token", data.token);
            localStorage.setItem("userType", data.userType);
            localStorage.setItem("name", data.name);  // 👈 **Kullanıcı Adını Kaydediyoruz**
            
            if (!data.id) {
                localStorage.setItem("id", "ADMIN");
            } else {
                localStorage.setItem("id", data.id);
            }


            // 📌 **Başarılı giriş sonrası yönlendirme**
            navigate("/dashboard");


        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
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
                        className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </form>
            </div>
        </div>
    );
}
