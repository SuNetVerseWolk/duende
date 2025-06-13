"use client";
import { useState } from "react";

const Card = () => {
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateDefinition = async () => {
    if (!term.trim()) {
      setError("Please enter a term");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/define", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "", term: term.trim() }),
      });

      if (!response.ok) throw new Error("Definition generation failed");

      const data = await response.json();
      setDefinition(data.definition);
    } catch (err) {
      setError("Failed to generate definition");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="bg-black bg-opacity-90 shadow-2xl text-white
               transform transition-transform duration-500
               border border-gray-700 p-2 sm:p-3 md:p-4 rounded-md
               w-full max-w-md mx-auto"
    >
      <input
        type="text"
        className="w-full px-3 sm:px-4 py-2 text-white bg-gray-700 border-b border-b-gray-600
                        focus:border-b-white placeholder-gray-400
                        transition-colors duration-300 text-sm sm:text-base"
        placeholder="Термин"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <input
        type="text"
        className="w-full px-3 sm:px-4 py-2 text-white bg-gray-700 border-b border-b-gray-600
                        focus:border-b-white placeholder-gray-400
                        transition-colors duration-300 text-sm sm:text-base mt-2"
        placeholder="Перевод"
        value={definition}
        onChange={(e) => setDefinition(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

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
          onClick={handleGenerateDefinition}
          disabled={isLoading}
        >
          Ai
        </button>
      </div>
    </div>
  );
};

export default Card;
