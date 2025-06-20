"use client";

import MySetsContainer from "@/components/MySetsContainer";
import { useState, useEffect } from "react";
import UserSetsContainer from "@/components/UserSetsContainer";
import { useProfile } from "@/hooks/useAuth";

export default function Home() {
  const { data: profile, isLoading: profileIsLoading } = useProfile();
  const [isMySets, setIsMySets] = useState(false);

  useEffect(() => {
    if (profile) setIsMySets(true);
  }, [profile]);

  return (
    <>
      <main className="flex justify-center w-full h-[80%]">
        <div className="relative flex justify-center flex-col mt-7 w-[80%] full-width-on-small h-[90%]">
          <div className="text-white">
            {profile && (
              <button
                onClick={() => setIsMySets(true)}
                className={`px-3 py-1.5 rounded-t-lg ${
                  isMySets ? "bg-white/5" : "bg-none"
                }`}
              >
                Мои наборы
              </button>
            )}
            <button
              onClick={() => setIsMySets(false)}
              className={`px-3 py-1.5 rounded-t-lg ${
                !isMySets ? "bg-white/5" : "bg-none"
              }`}
            >
              Общие
            </button>
          </div>
          {isMySets ? (
            profile ? (
              <MySetsContainer />
            ) : (
              <p className="text-white">Загрузка профиля...</p>
            )
          ) : (
            <UserSetsContainer />
          )}
        </div>
      </main>
    </>
  );
}