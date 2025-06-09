import { Set } from "./Set";
import "../app/globals.css";
import { useWholeProfiles } from "@/hooks/useAuth";

export default function UserSetsContainer() {
	const { data, isLoading } = useWholeProfiles();

  return (
    <div className="h-[100%] overflow-y-scroll no-scrollbar border-white/5 border-1 px-4 rounded-2xl">
      {isLoading ? (
        <div>Загрузка</div>
      ) : data?.length == 0 ? (
				<div>Пусто</div>
			) : (
        data?.map((profile) => (
          <div key={profile.id} className="text-white">
            <div
              className="flex items-center 
                    hover:text-white/70 transition-colors duration-300
                    bg-white/5 w-fit rounded-t-lg p-1 mt-2 cursor-pointer"
            >
              <div className="rounded-full w-7 h-7 bg-blue-900"></div>

              <h2 className="px-2 py-1.5">{profile.name}</h2>
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2
                    bg-white/5 p-5 rounded-b-2xl rounded-r-2xl
                    "
            >
              {profile.Sets?.map((values) => (
                <Set key={values.id} {...values} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
