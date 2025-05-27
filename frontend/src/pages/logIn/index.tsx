import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import "../../app/globals.css";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LogIn() {
  const router = useRouter();
  const [formData, setFromData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFromData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error, data } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      console.log(error);
      alert("Пароль неверный");
    } else {
      router.replace("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-black via-[#1f2834] to-black px-4">
      <div
        className="w-full max-w-md p-8 bg-black bg-opacity-90 rounded-xl shadow-2xl
                      transform transition-transform duration-500 hover:scale-105
                      border border-gray-700"
      >
        <h1 className="text-4xl text-center text-white mb-8 animate-pulse">
          Вход
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-300 mb-1"
            >
              Email
            </label>
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
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-300 mb-1"
            >
              Пароль
            </label>
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
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <div className="flex items-center justify-between">
            <Link
              href="/forget"
              className="text-xs text-blue-400 hover:underline"
            >
              Забыли пароль?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded
                       hover:bg-blue-700 transition-colors duration-300 shadow-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Войти
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-300">
          Нет аккаунта?{" "}
          <Link
            href="./signUp"
            className="font-medium text-blue-400 hover:underline"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
