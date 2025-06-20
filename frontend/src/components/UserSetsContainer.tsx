import { Set } from "./Set";
import "../app/globals.css";
import { useUser, useWholeProfiles } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { useUserEmail } from "@/hooks/useUserEmail";
import { profile } from "console";
import { useParams } from "next/navigation";

export default function UserSetsContainer() {
  const { data, isLoading } = useWholeProfiles();
  const { data: user, isLoading: userIsLoading } = useUser();

  return (
    <div className="h-[100%] overflow-y-scroll no-scrollbar border-white/5 border-1 px-4 rounded-2xl">
      {isLoading ? (
        <div className="flex justify-center items-center text-gray-400 h-full w-full">Загрузка...</div>
      ) : data?.length == 0 ? (
        <div className="flex justify-center items-center text-gray-400 h-full w-full">Пусто</div>
      ) : (
        data?.map(
          (profile) =>
            profile.Sets.length > 0 && (
              <div key={profile.id} className="text-white">
                <Link
									href={`user/${profile.id}`}
                  className="flex items-center 
                    hover:text-white/70 transition-colors duration-300
                    bg-white/5 w-fit rounded-t-lg p-1 mt-2 cursor-pointer"
                >
                  <Image
                    className={`w-10 h-10 filter rounded-full ${
                      profile?.avatar ? "" : "invert"
                    }`}
                    src={profile?.avatar || "/userIcon.png"}
                    alt="User Icon"
                    width={40}
                    height={40}
                  />
                  {/*<div className="rounded-full w-7 h-7 bg-blue-900"></div>*/}

                  <h2 className="px-2 py-1.5">{profile?.name || user?.email}</h2>
                </Link>

                <div
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2
                    bg-white/5 p-5 rounded-b-2xl rounded-r-2xl
                    "
                >
                  {profile.Sets?.map((values) => (
                    <Set key={values?.id} {...values} />
                  ))}
                </div>
              </div>
            )
        )
      )}
    </div>
  );
}
