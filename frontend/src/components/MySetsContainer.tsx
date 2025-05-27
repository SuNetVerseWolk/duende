"use client";

import {Set} from "@/components/Set";
import PopUpAddingSets from "@/components/PopUpAddiningSets";
import { useState } from "react";

interface CardData {
    id: number;
    name: string;
    amount: string;
    owner: string;
  }
  
interface MySetsContainerProps {
    cards: CardData[];
}

export default function MySetsContainer({ cards }: MySetsContainerProps) {
    const [openPopUpAdding, setOpenPopUpAdding] = useState(false);

    return(
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2
                        bg-white/5 p-5 rounded-b-2xl rounded-r-2xl
        ">
            {cards.map((el) => (
              <Set key={el.id} {...el} />
            ))}
            <div className="absolute top-[50] left-[-50]">
              <button onClick={() => setOpenPopUpAdding(!openPopUpAdding)} className="p-2 font-semibold text-white bg-blue-600 rounded-sm
                       hover:bg-blue-700 transition-colors shadow-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 duration-300">
                <img className="w-6 h-6 brightness-20 invert-100" src="/plus_2.png" alt="" />
              </button>

              {openPopUpAdding && <PopUpAddingSets />}
            </div>
        </div>
    );
}