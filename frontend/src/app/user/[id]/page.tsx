"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  useProfile,
  useUpdateProfile,
  useUser,
	useUserSets,
} from "@/hooks/useAuth";
import { Set } from "@/components/Set";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Warn from "@/components/Warn";
import { supabase, supabaseAdmin } from "@/lib/supabaseClient";
import { useUserEmail } from "@/hooks/useUserEmail";
import { useCreateSet } from "@/hooks/useSets";
import { Sets } from "../../../../generated/prisma";

const Page = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: user, isLoading: userIsLoading } = useUser();
  //   const { data: profile, isLoading: profileIsLoading } = useProfile();
  const { mutate: updateProfile } = useUpdateProfile();
  // const { data: mySets, isLoading, isError, error, refetch } = useMySets();

  const params = useParams();
  const userId = params?.id as string;

  const {
    data: userSets,
    error,
    isLoading: isloadingSet,
    refetch,
  } = useUserSets(userId);

  const { data: profile, isLoading: profileIsLoading } = useProfile(userId);

  const {
    data: email,
    isLoading: emailLoading,
    error: emailError,
  } = useUserEmail(userId);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [warnVisible, setWarnVisible] = useState(false);
  const [warnText, setWarnText] = useState("");
  const [warnAction, setWarnAction] = useState<
    "signOut" | "deleteAccount" | null
  >(null);

  console.log(profile?.id);

  const defaultData = useMemo(() => ({ 
        privacy: true,
        name: "Новый набор"
    } as Sets), []);

    const [data, setData] = useState<Sets>(defaultData);
    const { mutate, isPending } = useCreateSet();

    const handleSubmit = () => {
        mutate(data, {
            onSuccess: () => {
            setData(defaultData);
            },
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

  useEffect(() => {
    if (warnVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [warnVisible]);

  const { mutate: signOut } = useMutation({
    mutationFn: async () => await supabase.auth.signOut(),
    onSuccess() {
      queryClient.resetQueries();
      router.replace("/");
    },
  });

  const { mutate: deleteUser } = useMutation({
    mutationFn: async (e: any) =>
      await supabaseAdmin.auth.admin.deleteUser(user!.id),
    onSuccess() {
      queryClient.resetQueries();
      router.replace("/");
    },
  });

  const openWarn = (action: "signOut" | "deleteAccount") => {
    setWarnAction(action);
    setWarnText(
      action === "signOut"
        ? "Вы действительно хотите выйти?"
        : "Вы хотите удалить аккаунт?"
    );
    setWarnVisible(true);
  };

  const onConfirm = () => {
    setWarnVisible(false);
    if (warnAction === "signOut") {
      signOut();
    } else if (warnAction === "deleteAccount") {
      deleteUser(null);
    }
  };

  const onCancel = () => {
    setWarnVisible(false);
    setWarnAction(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedImage(e.target.files[0]);
      updateProfile(
        {
          id: user!.id,
          data: {},
          avatar: e.target.files[0],
        },
        {
          onSuccess: () => setSelectedImage(null),
        }
      );
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gradient-to-r from-black via-[#1f2834] to-black px-4">
      {warnVisible && (
        <Warn text={warnText} onConfirm={onConfirm} onCancel={onCancel} />
      )}

      <div className="w-lg h-full">
        <form className="flex flex-row flex-wrap justify-center max-w-2xl mx-auto gap-3 sm:gap-4 bg-white/5 p-4 sm:p-5 md:p-6 rounded-2xl my-4 sm:my-5">
          <div className="relative w-10 h-10">
            <Image
              className={`w-full filter rounded-full ${
                profile?.avatar ? "" : "invert"
              }`}
              src={profile?.avatar || "/userIcon.png"}
              alt="User Icon"
              width={40}
              height={40}
            />
            {user?.id === profile?.id && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer h-full"
              />
            )}
          </div>
          <div className="flex flex-col gap-3 sm:gap-4 md:w-[300px]">
            <input
              name="email"
              className="w-full px-3 sm:px-4 py-2 text-white bg-gray-700/90 border border-gray-600 rounded-lg
                                        focus:border-white focus:ring-2 focus:ring-white focus:outline-none
                                        transition-colors duration-300 placeholder-gray-400 text-sm sm:text-base"
              placeholder={emailLoading ? "Загрузка..." : "Email"}
              defaultValue={email}
              required
              minLength={2}
              maxLength={100}
              disabled={user?.id !== profile?.id}
            />
            <input
              name="name"
              className="w-full px-3 sm:px-4 py-2 text-white bg-gray-700/90 border border-gray-600 rounded-lg
                                        focus:border-white focus:ring-2 focus:ring-white focus:outline-none
                                        transition-colors duration-300 placeholder-gray-400 text-sm sm:text-base"
              placeholder={profileIsLoading ? "Загрузка..." : "Имя"}
              defaultValue={profile?.name ? profile.name : "Без имени"}
              maxLength={500}
              disabled={user?.id !== profile?.id}
            />

            {user?.id === profile?.id && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-1">
                <button
                  type="submit"
                  className="text-white font-semibold bg-blue-600 hover:bg-blue-700 
                                            transition-colors duration-300 shadow-md focus:outline-none 
                                            focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                                            py-1.5 sm:py-2 px-4 rounded-sm text-sm sm:text-base flex-1 text-center
                                            disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Изменить
                </button>
                <button
                  type="button"
                  onClick={() => openWarn("signOut")}
                  className="text-white font-semibold bg-blue-600 hover:bg-blue-700 
                                            transition-colors duration-300 shadow-md focus:outline-none 
                                            focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                                            py-1.5 sm:py-2 px-4 rounded-sm text-sm sm:text-base flex-1 text-center
                                            disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Выйти
                </button>
                <button
                  type="button"
                  onClick={() => openWarn("deleteAccount")}
                  className="text-white font-semibold bg-red-600 hover:bg-red-700
                                            transition-colors duration-300 shadow-md focus:outline-none 
                                            focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                                            py-1.5 sm:py-2 px-4 rounded-sm text-sm sm:text-base flex-1 text-center
                                            disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Удалить
                </button>
              </div>
            )}
          </div>
        </form>

        {user?.id === profile?.id && (
          <button
            className="text-white font-semibold bg-blue-900 hover:bg-blue-700 
                                    transition-colors duration-300 shadow-md focus:outline-none w-full
                                    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                                    py-1.5 sm:py-2 px-4 rounded-sm text-sm sm:text-base flex-1 text-center
                                    disabled:opacity-50 disabled:cursor-not-allowed my-2"
            disabled={isPending}
            onClick={() => {
            setData({
                ...defaultData,
                name: "Новый набор"
            });
            handleSubmit();
            }}
          >
            {isPending ? "Добавляется..." : "Добавить набор"}
          </button>
        )}

        <div className="flex flex-col bg-white/5 p-5 min-h-50 rounded-2xl overflow-auto">
          {error ? (
            <div className="flex justify-center items-center">
              <div className="flex flex-col justify-center items-center text-gray-400 space-y-1">
                <p>{error.message}</p>
                <button
                  onClick={() => refetch()}
                  className="bg-black bg-opacity-90 shadow-2xl text-white
                                                                transform transition-transform duration-500 hover:scale-105
                                                                hover:border-b-4 hover:border-b-blue-500
                                                                border border-gray-700 p-1 rounded-md cursor-pointer"
                >
                  Повторить
                </button>
              </div>
            </div>
          ) : !userSets ? (
            <span className="flex justify-center items-center text-gray-400 h-full w-full">
              {isloadingSet ? "Загрузка" : "Пусто"}
            </span>
          ) : (
            <div className="w-full grid grid-cols-1 gap-2">
              {userSets?.map((el) => (
                <Set
                  key={el.id}
                  {...el}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
