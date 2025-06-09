"use client";

import React from "react";
import Card from "@/components/Card";
import UserSetItem from "@/components/UserSetItem";
import { useCard, useCreateCard, useCardsForSet } from "@/hooks/useCards";
import { useState } from "react";

const Page = ({ setId }: { setId: bigint }) => {
  const { data: cards, isLoading, error } = useCardsForSet(setId);

  const createCardMutation = useCreateCard();

  const [isAdding, setIsAdding] = useState(false);

  const handleAddCard = async () => {
    setIsAdding(true);
    try {
      await createCardMutation.mutateAsync({
        setId,
        title: "Новая карточка",
        content: "Описание карточки",
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
          {isAdding ? "Добавление..." : "Добавить карточку"}
        </button>

        <div className="flex flex-col bg-white/5 p-5 min-h-50 rounded-2xl overflow-auto">
          {isLoading && <p className="text-gray-400">Загрузка карточек...</p>}
          {error && (
            <p className="text-red-500">Ошибка загрузки карточек</p>
          )}
          {cards && cards.length === 0 && (
            <p className="text-gray-400">Карточек пока нет</p>
          )}
          {cards ? (
            cards.map((card) => (
              <Card key={card.id} {...card} />))
          ): (
            <span className="text-gray-400">Пусто</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;