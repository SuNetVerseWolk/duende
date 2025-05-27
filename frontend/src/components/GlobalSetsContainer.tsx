import { Set } from "./Set";
import GlobalUserSets from "./GlobalUserSets";
import "../app/globals.css";

interface Set {
    id: number;
    name: string;
    amount: string;
    owner: string;
}
interface UserData {
    id: number;
    name: string;
    cards: Set[];
}

const users: UserData[] = [
    {
      id: 1,
      name: "Niga Vailent",
      cards: [
        {
            id: 1,
            name: "Fitness",
            amount: "2",
            owner: "ME"
        },
        {
            id: 2,
            name: "Fitness",
            amount: "2",
            owner: "ME"
        },
        {
            id: 3,
            name: "Fitness",
            amount: "2",
            owner: "ME"
        },
        {
            id: 4,
            name: "Fitness",
            amount: "2",
            owner: "ME"
        },
        {
            id: 5,
            name: "Fitness",
            amount: "2",
            owner: "ME"
        },
        {
            id: 6,
            name: "Fitness",
            amount: "2",
            owner: "ME"
        }
      ]
    },
    {
      id: 2,
      name: "Rol Mailon",
      cards: [
        {
            id: 1,
            name: "Fitness",
            amount: "2",
            owner: "ME"
        },
        {
            id: 2,
            name: "Fitness",
            amount: "2",
            owner: "ME"
        },
        {
            id: 3,
            name: "Fitness",
            amount: "2",
            owner: "ME"
        }
      ]
    },
    {
      id: 3,
      name: "Frage Rio",
      cards: [
        {
            id: 1,
            name: "Fitness",
            amount: "2",
            owner: "ME"
        },
        {
            id: 2,
            name: "Fitness",
            amount: "2",
            owner: "ME"
        }
      ]
    },
];

export default function GlobalSetsContainer() {
    return(
        <div className="h-120 overflow-y-scroll no-scrollbar border-white/5 border-1 px-4 rounded-2xl">
            {users.map((el)=> (
                <div key={el.id} className="text-white">
                    <div className="flex items-center 
                    hover:text-white/70 transition-colors duration-300
                    bg-white/5 w-fit rounded-t-lg p-1 mt-2 cursor-pointer">
                        <div className="rounded-full w-7 h-7 bg-blue-900"></div>

                        <h2 className="px-2 py-1.5">{el.name}</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2
                    bg-white/5 p-5 rounded-b-2xl rounded-r-2xl
                    ">
                        {el.cards.map((card) => (
                            <Set key={card.id} {...card} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}