"use client";

import { Set } from "@/components/Set";
import PopUpAddingSets from "@/components/PopUpAddiningSets";
import { useState } from "react";
import { useMySets } from "@/hooks/useAuth";

export default function MySetsContainer() {
  const [openPopUpAdding, setOpenPopUpAdding] = useState(false);
  const { data: mySets, isLoading, isError, error, refetch } = useMySets();
	console.log(mySets)

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2
                        bg-white/5 p-5 rounded-b-2xl rounded-r-2xl
        "
    >
      {isError ? (
        <div className="text-gray-400 space-y-1">
          <p>{error.name}</p>
          <hr />
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
      ) : isLoading ? (
        <span className="text-gray-400">Загрузка</span>
      ) : mySets?.length === 0 ? (
        <span className="text-gray-400">Пусто</span>
      ) : (
        mySets?.map((el) => <Set key={el.id} {...el} />)
      )}
      <div className="absolute top-[50] left-[-50]">
        <button
          onClick={() => setOpenPopUpAdding(!openPopUpAdding)}
          className="p-2 font-semibold text-white bg-blue-600 rounded-sm
                       hover:bg-blue-700 transition-colors shadow-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 duration-300"
        >
          <img
            className="w-6 h-6 brightness-20 invert-100"
            src="/plus_2.png"
            alt=""
          />
        </button>

        {openPopUpAdding && <PopUpAddingSets onSuccess={() => setOpenPopUpAdding(false)}/>}
      </div>
    </div>
  );
}
