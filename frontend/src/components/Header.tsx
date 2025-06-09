"use client";
import { useUser } from "@/hooks/useAuth";
import Link from "next/link";
import React from "react";

const Header = () => {
  const { data: user, isLoading: userIsLoading } = useUser();

  return (
    <header className="flex justify-center items-center pt-10 px-4">
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center w-[100%] min-w-[70%] md:max-w-[80%] gap-4 sm:gap-0">
        <div className="relative flex items-center w-full sm:w-auto h-10">
          <img
            className="absolute left-3 w-5 h-5 brightness-10 invert-80"
            src="/loupe.png"
            alt="Поиск"
          />
          <input
            className="pl-10 pr-3 py-2 w-96 min-w-[100%] rounded-xl text-white bg-gray-700/30 border border-gray-600"
            type="text"
            placeholder="Поиск"
          />
        </div>

        <div className="flex flex-row-reverse justify-between w-[100%]">
          <button
            className="p-2 font-semibold text-white bg-blue-600 rounded-sm
                        hover:bg-blue-700 transition-colors shadow-md hidden show-on-small
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 duration-300"
          >
            <img
              className="w-6 h-6 brightness-20 invert-100"
              src="/plus_2.png"
              alt=""
            />
          </button>
          {user ? (
            <Link className="cursor-pointer flex flex-row gap-2 items-center" href={`/user/${user.id}`}>
              <img className="w-10 h-10 filter invert" src="/userIcon.png" alt="User Icon" />

              <p className="text-white font-semibold hide-on-small text-[9px] sm:text-base md:text-[10px] lg:text-[12px]">{user.email}</p>
            </Link>
          ) : (
            userIsLoading ? (
              <span className="text-white font-semibold">Загружается...</span>
            ): (
              <Link
                href="/logIn"
                className="text-white font-semibold bg-blue-600
                          hover:bg-blue-700 transition-colors duration-300 shadow-md
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          px-6 py-2 rounded-sm sm:w-auto text-center"
              >
                Вход
              </Link>
            )
          )}
        </div>
        </div>
    </header>
  );
};

export default Header;
