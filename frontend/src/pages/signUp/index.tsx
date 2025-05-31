import { ChangeEvent, FormEvent, useState } from "react";
import "../../app/globals.css";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function index() {
  const router = useRouter();
  const [formData, setFromData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFromData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.passwordConfirm.trim().length === 0) {
			return alert("Введите пароль");
		}

		if (formData.passwordConfirm != formData.password) {
			return alert("Пароли не совпадают")
		}

		if (formData.email) {
			const { error, data } = await supabase.auth.signUp({
				email: formData.email,
				password: formData.password,
			});

			console.log(data)
			if (error) {
				console.error(error);
			} else {
				router.replace("/confirm");
			}
		}
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-950 via-gray-800 to-gray-950 px-4">
      <div
        className="w-full max-w-md p-8 bg-gray-950 bg-opacity-90 rounded-xl shadow-2xl
                      transform transition-transform duration-500 hover:scale-105
                      border border-gray-700"
      >
        <h1 className="text-4xl text-center text-white mb-8 animate-pulse">
          Регистрация
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="block w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded
                         focus:border-white focus:ring focus:ring-white focus:outline-none
                         transition-colors duration-300"
              placeholder="ФИО"
            />
          </div>
          <div>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="block w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded
                         focus:border-white focus:ring focus:ring-white focus:outline-none
                         transition-colors duration-300"
              placeholder="E-mail"
            />
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="block w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded
                         focus:border-blue-500 focus:ring focus:ring-blue-400 focus:outline-none
                         transition-colors duration-300"
              placeholder="Пароль"
            />
          </div>
          <div>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              required
              value={formData.passwordConfirm}
              onChange={handleInputChange}
              className="block w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded
                         focus:border-blue-500 focus:ring focus:ring-blue-400 focus:outline-none
                         transition-colors duration-300"
              placeholder="Подтверждение пароля"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded
                       hover:bg-blue-700 transition-colors duration-300 shadow-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
}
