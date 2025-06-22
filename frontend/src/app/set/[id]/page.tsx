"use client";

import React, { useMemo, useState } from "react";
import Card from "@/components/Card";
import UserSetItem from "@/components/UserSetItem";
import { useCreateCard, useCardsForSet } from "@/hooks/useCards";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/hooks/useAuth";
import { useCreateSet } from "@/hooks/useSets"
import { toast } from "react-hot-toast";

const Page = () => {
  const params = useParams();
	const router = useRouter();
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
      toast.success("Card added successfully");
    } catch (e) {
      console.error("Error adding card", e);
      toast.error("Failed to add card");
    } finally {
      setIsAdding(false);
    }
  };

  const handleMakeMine = async () => {
    if (!set || !user) {
      toast.error("Set or user information missing");
      return;
    }

    setIsAdding(true);
    try {
      const newSet = await createSetMutation.mutateAsync({
        description: set.description || "",
        name: set.name || "Untitled Set",
        privacy: set.privacy || false,
      });

      if (set.Cards?.length) {
        await Promise.all(
          set.Cards.map((card) =>
            createCardMutation.mutateAsync({
              id_set: BigInt(newSet.data.id),
              text: card.text,
              translation: card.translation,
            })
          )
        );
      }
      
      toast.success("Set copied successfully");
			router.replace(`/set/${newSet.data.id}`);
    } catch (e) {
      console.error("Error copying set", e);
      toast.error("Failed to copy set");
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
          disabled={isAdding || isLoading}
          className="text-white font-semibold bg-blue-900 hover:bg-blue-700 
                    transition-colors duration-300 shadow-md focus:outline-none w-full
                    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                    py-1.5 sm:py-2 px-4 rounded-sm text-sm sm:text-base flex-1 text-center
                    disabled:opacity-50 disabled:cursor-not-allowed my-2"
        >
          {isAdding
            ? "Добавляется..."
            : isMine
            ? "Добавить карточку"
            : "Добавить набор к себе"}
        </button>

        <div className="flex flex-col bg-white/5 p-5 min-h-50 rounded-2xl overflow-auto">
          {isLoading ? (
            <p className="text-gray-400 text-center py-4">Загрузка карточек...</p>
          ) : error ? (
            <p className="text-red-500 text-center py-4">
              Ошибка загрузки: {error.message}
            </p>
          ) : set?.Cards?.length === 0 ? (
            <p className="text-gray-400 text-center py-4">Пусто</p>
          ) : (
            set?.Cards?.map((card) => (
              <Card key={card.id.toString()} {...card} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;