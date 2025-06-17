"use client";
import { ChangeEvent, useState } from "react";
import { Cards } from "../../generated/prisma";
import { useDeleteCard, useUpdateCard } from "@/hooks/useCards";

const Card: React.FC<Cards> = ({ ...params }) => {
  const [card, setCard] = useState<Omit<Cards, "id" | "created_at">>({
    text: params.text || "",
    translation: params.translation || "",
    id_set: params.id_set,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const updateCard = useUpdateCard(params.id);
  const deleteCard = useDeleteCard(params.id);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCard((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGenerateDefinition = async () => {
    if (!card.text?.trim()) {
      setError("Please enter a term");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/define", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: card.text.trim() }),
      });

      if (!response.ok) throw new Error("Definition generation failed");

      const data = await response.json();
      setCard((prev) => {
        const result = { ...prev, translation: data.definition };
        updateCard.mutate(result);

        return result;
      });
    } catch (err) {
      setError("Failed to generate definition");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  function handleBlur(
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    updateCard.mutate(card);
  }

  return (
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
        value={card.text!}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={deleteCard.isPending}
      />
      <textarea
        id="translation"
        name="translation"
        className="w-full px-3 sm:px-4 py-2 text-white bg-gray-700 border-b border-b-gray-600
                        focus:border-b-white placeholder-gray-400
                        transition-colors duration-300 text-sm sm:text-base mt-2"
        placeholder="Определение"
        value={card.translation!}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={deleteCard.isPending}
      />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <div className="flex gap-2 mt-3 sm:mt-4">
        <button
          className="text-white font-semibold bg-red-900 text-sm sm:text-base
                        hover:bg-red-700 transition-colors duration-300 shadow-md
                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                        py-1 px-2 sm:py-1.5 sm:w-20 rounded-sm flex-1 sm:flex-none"
          onClick={() => deleteCard.mutate()}
          disabled={deleteCard.isPending}
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
          onClick={handleGenerateDefinition}
          disabled={isLoading || deleteCard.isPending}
        >
          Ai
        </button>
      </div>
    </div>
  );
};

export default Card;
