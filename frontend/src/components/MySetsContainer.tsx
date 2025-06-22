"use client";

import { Set } from "@/components/Set";
import PopUpAddingSets from "@/components/PopUpAddiningSets";
import { useState } from "react";
import { useMySets } from "@/hooks/useAuth";
import "../app/globals.css";
import { useSearch } from "@/hooks/useSearch";

export default function MySetsContainer() {
  const [openPopUpAdding, setOpenPopUpAdding] = useState(false);
  const { data: mySets, isLoading, isError, error, refetch } = useMySets();
  const { data: searchValue } = useSearch().watchSearch();

  const filteredSets = mySets?.filter((set) =>
    set.name?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className=" bg-white/5 p-5 rounded-b-2xl rounded-r-2xl h-[100%] no-scrollbar overflow-auto scroll-smooth">
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
      ) : filteredSets?.length == 0 ? (
        <span className="flex justify-center items-center text-gray-400 h-full w-full">
          {isLoading ? "Загрузка..." : "Пусто"}
        </span>
      ) : (
        <div className="w-full grid grid-cols-auto gap-2 md:gap-4">
          {filteredSets?.map((el) => (
            <Set key={el.id} {...el} />
          ))}
        </div>
      )}
      <div className="absolute top-[50] left-[-50]">
        <button
          className="p-2 font-semibold text-white bg-blue-600 rounded-sm
                       hover:bg-blue-700 transition-colors shadow-md hide-on-small
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 duration-300"
          onClick={() => setOpenPopUpAdding(!openPopUpAdding)}
        >
          <img
            className="w-6 h-6 brightness-20 invert-100"
            src="/plus_2.png"
            alt=""
          />
        </button>

        {openPopUpAdding && (
          <PopUpAddingSets onClose={() => setOpenPopUpAdding(false)} />
        )}
      </div>
    </div>
  );
}
