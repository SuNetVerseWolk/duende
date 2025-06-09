"use client";

import MySetsContainer from "@/components/MySetsContainer";
import { useState } from "react";
import UserSetsContainer from "@/components/UserSetsContainer";

export default function Home() {
  // const dbPassword = "Supabase1987#";
  const [isMySets, setIsMine] = useState(true);

  return (
    <>
      <main className="flex justify-center w-full h-[85%]">
        <div className="relative flex justify-center flex-col mt-7 w-[80%] full-width-on-small h-[90%]">
          <div className="text-white">
            <button onClick={() => setIsMine(true)} className={`px-3 py-1.5 rounded-t-lg ${isMySets ? 'bg-white/5' : 'bg-none'}`}>Мои наборы</button>
            <button onClick={() => setIsMine(!isMySets)} className={`px-3 py-1.5 rounded-t-lg ${isMySets ? 'bg-none' : 'bg-white/5'}`}>Общие</button>
          </div>

          {isMySets ? (
            <MySetsContainer />
          ): (
            <UserSetsContainer />
          )}
        </div>
      </main>
    </>
  );
}
