import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-blue-600 text-white p-4 text-center text-xl">
        Osius ERP Panel
      </header>
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Hoş geldin! 🎉</h1>
        <p>ERP paneline giriş yaptın.</p>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </main>
    </div>
  );
}
