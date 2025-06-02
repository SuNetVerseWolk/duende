"use client";
import { useProfile, useUser } from "@/hooks/useAuth";
import Link from "next/link";
import React from "react";

const Header = () => {
	const { data: user } = useUser();
	const { data: profile, isLoading } = useProfile(user?.id as string);

  return (
    <header className="flex justify-center items-center pt-10">
      <div className="flex justify-between items-center lg:w-[840px] md:w-[500px]">
        <div className="relative flex items-center h-7">
          <img
            className="absolute left-2 w-4 h-4 brightness-10 invert-80"
            src="/loupe.png"
            alt=""
          />

          <input
            className="pl-8 pr-2 py-2 w-100 rounded-xl text-white bg-gray-700/30 border-gray-600 border-1"
            type="text"
            placeholder="Поиск"
          />
        </div>

        <Link
          href="/logIn"
          className="text-white font-semibold bg-blue-600
                       hover:bg-blue-700 transition-colors duration-300 shadow-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-15 px-15 py-2 rounded-sm"
        >
          {profile ? "Выход" : "Вход"}
        </Link>
      </div>
    </header>
  );
};

export default Header;
