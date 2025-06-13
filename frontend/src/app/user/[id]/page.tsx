"use client";

import React, { useMemo } from "react";
import { useMySets, useProfile, useUser } from "@/hooks/useAuth";
import { Set } from "@/components/Set";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page = () => {
  const { data: user, isLoading: userIsLoading } = useUser();
  const { data: profile, isLoading: profileIsLoading } = useProfile();
  const {
    data: mySets,
    isLoading: mySetsIsLoading,
    isError,
    error,
    refetch,
  } = useMySets();
  const isLoading = useMemo(
    () => userIsLoading && profileIsLoading && mySetsIsLoading,
    [userIsLoading, mySetsIsLoading, profileIsLoading]
  );
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/logIn");
    router.refresh();
  };

  return (
    <div className="flex justify-center min-h-screen bg-gradient-to-r from-black via-[#1f2834] to-black px-4">
      <div className="w-lg h-full">
        <form className="flex flex-row flex-wrap justify-center max-w-2xl mx-auto gap-3 sm:gap-4 bg-white/5 p-4 sm:p-5 md:p-6 rounded-2xl my-4 sm:my-5">
          <div className="cursor-pointer">
            <Image
              className={`w-10 h-10 filter ${profile?.avatar ? "" : "invert"}`}
              src={profile?.avatar || "/userIcon.png"}
              alt="User Icon"
              width={40}
              height={40}
            />
          </div>
          <div className="flex flex-col gap-3 sm:gap-4 ">
            <input
              name="email"
              className="w-full px-3 sm:px-4 py-2 text-white bg-gray-700/90 border border-gray-600 rounded-lg
                                        focus:border-white focus:ring-2 focus:ring-white focus:outline-none
                                        transition-colors duration-300 placeholder-gray-400 text-sm sm:text-base"
              placeholder={isLoading ? "Загрузка..." : "Email"}
              defaultValue={user?.email}
              required
              minLength={2}
              maxLength={100}
            />
            <input
              name="name"
              className="w-full px-3 sm:px-4 py-2 text-white bg-gray-700/90 border border-gray-600 rounded-lg
                                        focus:border-white focus:ring-2 focus:ring-white focus:outline-none
                                        transition-colors duration-300 placeholder-gray-400 text-sm sm:text-base"
              placeholder={isLoading ? "Загрузка..." : "Имя"}
              defaultValue={profile?.name ? profile.name : ""}
              maxLength={500}
            />

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-1">
              <button
                type="submit"
                className="text-white font-semibold bg-blue-600 hover:bg-blue-700 
                                    transition-colors duration-300 shadow-md focus:outline-none 
                                    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                                    py-1.5 sm:py-2 px-4 rounded-sm text-sm sm:text-base flex-1 text-center
                                    disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Изменить
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="text-white font-semibold bg-blue-600 hover:bg-blue-700 
                                    transition-colors duration-300 shadow-md focus:outline-none 
                                    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                                    py-1.5 sm:py-2 px-4 rounded-sm text-sm sm:text-base flex-1 text-center
                                    disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Выйти
              </button>
              <button
                type="button"
                className="text-white font-semibold bg-red-600 hover:bg-red-700 
                                    transition-colors duration-300 shadow-md focus:outline-none 
                                    focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                                    py-1.5 sm:py-2 px-4 rounded-sm text-sm sm:text-base flex-1 text-center
                                    disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Удалить
              </button>
            </div>
          </div>
        </form>

        <button
          className="text-white font-semibold bg-blue-900 hover:bg-blue-700 
                                transition-colors duration-300 shadow-md focus:outline-none w-full
                                focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                                py-1.5 sm:py-2 px-4 rounded-sm text-sm sm:text-base flex-1 text-center
                                disabled:opacity-50 disabled:cursor-not-allowed my-2"
        >
          Добавить набор
        </button>

        <div className="flex flex-col bg-white/5 p-5 min-h-50 rounded-2xl overflow-auto">
          {isError ? (
            <div className="flex justify-center items-center">
              <div className="flex flex-col justify-center items-center text-gray-400 space-y-1">
                <p>{error.message}</p>
                <button
                  onClick={(e) => refetch()}
                  className="bg-black bg-opacity-90 shadow-2xl text-white
                                                                transform transition-transform duration-500 hover:scale-105
                                                                hover:border-b-4 hover:border-b-blue-500
                                                                border border-gray-700 p-1 rounded-md cursor-pointer"
                >
                  Повторить
                </button>
              </div>
            </div>
          ) : !mySets ? (
            <span className="flex justify-center items-center text-gray-400 h-full w-full">
              {isLoading ? "Загрузка" : "Пусто"}
            </span>
          ) : (
            <div className="w-full grid grid-cols-1 gap-2">
              {mySets?.map((el) => (
                <Set key={el.id} {...el} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
