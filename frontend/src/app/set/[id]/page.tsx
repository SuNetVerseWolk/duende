"use client";

import React from "react";
import Card from "@/components/Card";
import UserSetItem from "@/components/UserSetItem";
import { useCreateCard, useCardsForSet } from "@/hooks/useCards";
import { useState } from "react";
import { useParams } from "next/navigation";

const Page = () => {
	const params = useParams();
	const setId = (params?.id ? params.id : "") as string;
  const { data: set, isLoading, error } = useCardsForSet(setId);

  const createCardMutation = useCreateCard();

  const [isAdding, setIsAdding] = useState(false);

  const handleAddCard = async () => {
    setIsAdding(true);
    try {
      await createCardMutation.mutateAsync({
        id_set: BigInt(setId),
        text: "",
        translation: "",
      });
    } catch (e) {
      console.error("Ошибка при добавлении карточки", e);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gradient-to-r from-black via-[#1f2834] to-black px-4">
      <div className="w-lg h-full">
        <UserSetItem />

        <button
          onClick={handleAddCard}
          disabled={isAdding}
          className="text-white font-semibold bg-blue-900 hover:bg-blue-700 
                    transition-colors duration-300 shadow-md focus:outline-none w-full
                    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                    py-1.5 sm:py-2 px-4 rounded-sm text-sm sm:text-base flex-1 text-center
                    disabled:opacity-50 disabled:cursor-not-allowed my-2"
        >
          {isAdding ? "Добавление..." : "Добавить набор"}
        </button>

        <div className="flex flex-col bg-white/5 p-5 min-h-50 rounded-2xl overflow-auto">
          {isLoading ? <p className="text-gray-400">Загрузка карточек...</p> :
          error ? (
            <p className="text-red-500">Ошибка загрузки карточек</p>
          ) : set && set.Cards?.length === 0 ? (
            <p className="text-gray-400">Карточек пока нет</p>
          ) : set?.Cards ? (
            set.Cards.map((card) => (
              <Card key={card.id} {...card} />))
          ): (
            <span className="text-gray-400">Пусто</span>
          )}
    <div
      className="bg-black bg-opacity-90 shadow-2xl text-white
               transform transition-transform duration-500
               border border-gray-700 p-2 sm:p-3 md:p-4 rounded-md
               w-full max-w-md mx-auto"
    >
      <input
        id="text"
        name="text"
        type="text"
        className="w-full px-3 sm:px-4 py-2 text-white bg-gray-700 border-b border-b-gray-600
                        focus:border-b-white placeholder-gray-400
                        transition-colors duration-300 text-sm sm:text-base"
        placeholder="Термин"
        disabled={true}
      />
      <textarea
        id="translation"
        name="translation"
        className="w-full px-3 sm:px-4 py-2 text-white bg-gray-700 border-b border-b-gray-600
                        focus:border-b-white placeholder-gray-400
                        transition-colors duration-300 text-sm sm:text-base mt-2"
        placeholder="Определение"
        disabled={true}
      />

      {error && <p className="text-red-500 text-sm mt-2"></p>}

      <div className="flex gap-2 mt-3 sm:mt-4">
        <button
          className="text-white font-semibold bg-red-900 text-sm sm:text-base
                        hover:bg-red-700 transition-colors duration-300 shadow-md
                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                        py-1 px-2 sm:py-1.5 sm:w-20 rounded-sm flex-1 sm:flex-none"
        >
          Удалить
        </button>
        <button
          className={`text-white font-semibold bg-black border text-sm sm:text-base
                        hover:bg-white hover:text-black transition-colors duration-300 shadow-md
                        py-1 px-2 sm:py-1.5 sm:w-10 rounded-sm flex-1 sm:flex-none ${
                          isLoading
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-black border hover:bg-white hover:text-black"
                        }`}
        >
          Ai
        </button>
      </div>
    </div>
        </div>
      </div>
    </div>
  );
};

export default Page;