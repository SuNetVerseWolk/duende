import { Set } from "./Set";
import "../app/globals.css";
import { useSets } from "@/hooks/useSets";

export default function UserSetsContainer() {
  const { data: sets } = useSets();

  if (sets?.length === 0) {
    return;
  }

  return (
    <div className="h-120 overflow-y-scroll no-scrollbar border-white/5 border-1 px-4 rounded-2xl">
      {sets?.map((user) => (
        <div key={user.profileId} className="text-white">
          <div
            className="flex items-center 
                    hover:text-white/70 transition-colors duration-300
                    bg-white/5 w-fit rounded-t-lg p-1 mt-2 cursor-pointer"
          >
            <div className="rounded-full w-7 h-7 bg-blue-900"></div>

            <h2 className="px-2 py-1.5">{user.profileName}</h2>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2
                    bg-white/5 p-5 rounded-b-2xl rounded-r-2xl
                    "
          >
            {user.sets?.map((values) => (
              <Set key={values.id} {...values} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
