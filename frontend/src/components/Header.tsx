"use client";
import { useProfile, useUser } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";

const Header = () => {
  const { data: user, isLoading: userIsLoading } = useUser();
  const { data: profile, isLoading: profileIsLoading } = useProfile();
  const isLoading = useMemo(
    () => userIsLoading && profileIsLoading,
    [userIsLoading, profileIsLoading]
  );

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
          <Link href={'/set/0'}
            className="p-2 font-semibold text-white bg-blue-600 rounded-sm
                        hover:bg-blue-700 transition-colors shadow-md hidden show-on-small
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 duration-300"
          >
            <img
              className="w-6 h-6 brightness-20 invert-100"
              src="/plus_2.png"
              alt=""
            />
          </Link>
          {user ? (
            <Link
              className="cursor-pointer flex flex-row gap-2 items-center"
              href={`/user/${user.id}`}
            >
              <Image
                className={`w-10 h-10 filter ${profile?.avatar ? '' : 'invert'}`}
                src={profile?.avatar || "/userIcon.png"}
                alt="User Icon"
								width={40}
								height={40}
              />

              <p className="text-white font-semibold hide-on-small text-[9px] sm:text-base md:text-[10px] lg:text-[12px]">
                {profile?.name == null ? user.email: profile?.name}
              </p>
            </Link>
          ) : isLoading ? (
            <span className="text-white font-semibold">Загружается...</span>
          ) : (
            <Link
              href="/logIn"
              className="text-white font-semibold bg-blue-600
                          hover:bg-blue-700 transition-colors duration-300 shadow-md
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          px-6 py-2 rounded-sm sm:w-auto text-center"
            >
              Вход
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
