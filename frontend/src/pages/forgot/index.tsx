import { supabase } from "@/lib/supabaseClient";
import React, { FormEvent, useState } from "react";

const index = () => {
  const [email, setEmail] = useState("");

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		supabase.auth.resetPasswordForEmail(email, {redirectTo: '/confirm'});
	}

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-black via-[#1f2834] to-black px-4">
      <div
        className="w-full max-w-md p-8 bg-black bg-opacity-90 rounded-xl shadow-2xl
                      transform transition-transform duration-500 hover:scale-105
                      border border-gray-700"
      >
        <h1 className="text-4xl text-center text-white mb-8 animate-pulse">
          Забыли пароль
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded
                         focus:border-white focus:ring focus:ring-white focus:outline-none
                         transition-colors duration-300"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded
                       hover:bg-blue-700 transition-colors duration-300 shadow-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Подтвердить
          </button>
        </form>
      </div>
    </div>
  );
};

export default index;
