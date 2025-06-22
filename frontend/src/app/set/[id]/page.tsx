"use client";

import React, { useMemo } from "react";
import Card from "@/components/Card";
import UserSetItem from "@/components/UserSetItem";
import { useCreateCard, useCardsForSet } from "@/hooks/useCards";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useAuth";
import { useCreateSet } from "@/hooks/useSets";
import { Sets } from "../../../../generated/prisma";

const Page = () => {
  const params = useParams();
  const setId = (params?.id ? params.id : "") as string;
  const { data: user, isLoading: isUserLoading } = useUser();
  const { data: set, isLoading: isSetLoading, error } = useCardsForSet(setId);
  const isMine = useMemo(() => user?.id === set?.id_profile, [user, set]);
  const isLoading = useMemo(
    () => isSetLoading || isUserLoading,
    [isSetLoading, isUserLoading]
  );

  const createCardMutation = useCreateCard();
  const createSetMutation = useCreateSet();

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

  const handleMakeMine = async () => {
    if (!set && !user) {
      return;
    }

    setIsAdding(true);
    try {
      const newSet = await createSetMutation.mutateAsync({
        description: set?.description,
        name: set?.name,
        privacy: set?.privacy,
      } as Sets);

      if (set?.Cards && set.Cards.length > 0) {
        set.Cards.forEach(async (card) => {
          await createCardMutation.mutateAsync({
            id_set: BigInt(newSet.data.id),
            text: card.text,
            translation: card.translation,
          });
        });
      }
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
          onClick={isMine ? handleAddCard : handleMakeMine}
          disabled={isAdding}
          className="text-white font-semibold bg-blue-900 hover:bg-blue-700 
                    transition-colors duration-300 shadow-md focus:outline-none w-full
                    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                    py-1.5 sm:py-2 px-4 rounded-sm text-sm sm:text-base flex-1 text-center
                    disabled:opacity-50 disabled:cursor-not-allowed my-2"
        >
          {isAdding
            ? "Добавление..."
            : isMine
            ? "Добавить карточку"
            : "Добавить набор"}
        </button>

        <div className="flex flex-col bg-white/5 p-5 min-h-50 rounded-2xl overflow-auto">
          {isLoading ? (
            <p className="text-gray-400">Загрузка карточек...</p>
          ) : error ? (
            <p className="text-red-500">Ошибка загрузки карточек</p>
          ) : set && set.Cards?.length === 0 ? (
            <p className="text-gray-400">Карточек пока нет</p>
          ) : set?.Cards ? (
            set.Cards.map((card) => <Card key={card.id} {...card} />)
          ) : (
            <span className="text-gray-400">Пусто</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
