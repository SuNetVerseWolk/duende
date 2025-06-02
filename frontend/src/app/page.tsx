"use client";

import {Set} from "@/components/Set";
import GlobalSetsContainer from "@/components/GlobalSetsContainer";
import MySetsContainer from "@/components/MySetsContainer";
import PopUpAddingSets from "@/components/PopUpAddiningSets";
import { useState } from "react";

//interface CardData {
//  id: number;
//  name: string;
//  amount: string;
//  owner: string;
//}

//const cards: CardData[] = [
//  {
//    id: 1,
//    name: "Fitness",
//    amount: "2",
//    owner: "ME"
//  },
//  {
//    id: 2,
//    name: "Fitness",
//    amount: "2",
//    owner: "ME"
//  },
//  {
//    id: 3,
//    name: "Fitness",
//    amount: "2",
//    owner: "ME"
//  },
//  {
//    id: 4,
//    name: "Fitness",
//    amount: "2",
//    owner: "ME"
//  },
//  {
//    id: 5,
//    name: "Fitness",
//    amount: "2",
//    owner: "ME"
//  },
//  {
//    id: 6,
//    name: "Fitness",
//    amount: "2",
//    owner: "ME"
//  },
//  {
//    id: 7,
//    name: "Fitness",
//    amount: "2",
//    owner: "ME"
//  }
//];

export default function Home() {
  // const dbPassword = "Supabase1987#";
  const [isMySets, setIsMine] = useState(true);

  return (
    <>
      <main className="flex justify-center items-center w-full">
        <div className="relative flex justify-center flex-col mt-7">
          <div className="text-white">
            <button onClick={() => setIsMine(true)} className={`px-3 py-1.5 rounded-t-lg ${isMySets ? 'bg-white/5' : 'bg-none'}`}>Мои наборы</button>
            <button onClick={() => setIsMine(!isMySets)} className={`px-3 py-1.5 rounded-t-lg ${isMySets ? 'bg-none' : 'bg-white/5'}`}>Общие</button>
          </div>

          {isMySets ? (
            <MySetsContainer />
          ): (
            <GlobalSetsContainer/>
          )}
        </div>
      </main>
    </>
  );
}
