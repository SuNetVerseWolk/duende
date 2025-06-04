import { useCreateSet } from "@/hooks/useSets";
import { useMemo, useState } from "react";
import { Sets } from "../../generated/prisma";

export default function PopUpAddingSets() {
	const defaultData = useMemo(() => ({ privacy: true } as Sets), [])
	const [data, setData] = useState<Sets>(defaultData);
  const { mutate, isPending } = useCreateSet();

  return (
    <div className="relative top-[-50] left-15 p-5 bg-black border-1 rounded-lg text-white">
      <input
        className="w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded
                         focus:border-white focus:ring focus:ring-white focus:outline-none
                         transition-colors duration-300"
        type="text"
        placeholder="Название набора"
				onChange={e => setData(prev => ({...prev!, name: e.target.value}))}
      />

      <label className="my-5">
        <h3 className="mb-1">Выбор приватности</h3>

        <input type="radio" id="closed" name="check" checked onChange={e => setData(prev => ({...prev!, privacy: true}))} />
        <label htmlFor="closed">Закрытый</label>

        <input className="ml-3" type="radio" id="global" name="check" onChange={e => setData(prev => ({...prev!, privacy: false}))} />
        <label htmlFor="global">Глобальный</label>
      </label>

      <button
        className="py-2 font-semibold text-white bg-blue-600 w-full
                       hover:bg-blue-700 transition-colors shadow-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 duration-300 mt-4 rounded-sm"
				disabled={isPending}
				onClick={() => mutate(data, {onSuccess: () => setData(defaultData)})}
      >
        Добавить
      </button>
    </div>
  );
}
