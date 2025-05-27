import type { AppProps } from 'next/app'

export default function UserSetItem() {
  return(
    <div className="flex flex-col gap-2 bg-white/5 p-5 rounded-2xl my-5">
        <input className='w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg
                         focus:border-white focus:ring focus:ring-white focus:outline-none
                         transition-colors duration-300' placeholder='Название набора'></input>
        <input className='w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg
                         focus:border-white focus:ring focus:ring-white focus:outline-none
                         transition-colors duration-300' placeholder='Описание'></input>

        <div className="my-2 text-white">
          <h3 className="mb-1">Выбор приватности</h3>

          <input type="radio" id="closed" name="check"/>
          <label htmlFor="closed">Закрытый</label>

          <input className="ml-3" type="radio" id="global" name="check"/>
          <label htmlFor="global">Глобальный</label>
        </div>
        
        <div className='flex gap-3'>
          <button className='text-white font-semibold bg-blue-600
                        hover:bg-blue-700 transition-colors duration-300 shadow-md
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 py-1 w-50 rounded-sm'>Cохранить</button>
          <button className='text-white font-semibold bg-red-600
                        hover:bg-red-700 transition-colors duration-300 shadow-md
                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 py-1 w-50 rounded-sm'>Удалить</button>
        </div>
    </div>
  );
}