import type { AppProps } from 'next/app'

export default function UserSetItem() {
  return(
    <div className="flex flex-col gap-3 sm:gap-4 bg-white/5 p-4 sm:p-5 md:p-6 rounded-2xl my-4 sm:my-5 max-w-2xl mx-auto">
      <input className='w-full px-3 sm:px-4 py-2 text-white bg-gray-700/90 border border-gray-600 rounded-lg
                      focus:border-white focus:ring-2 focus:ring-white focus:outline-none
                      transition-colors duration-300 placeholder-gray-400 text-sm sm:text-base' 
            placeholder='Название набора' />
      
      <input className='w-full px-3 sm:px-4 py-2 text-white bg-gray-700/90 border border-gray-600 rounded-lg
                      focus:border-white focus:ring-2 focus:ring-white focus:outline-none
                      transition-colors duration-300 placeholder-gray-400 text-sm sm:text-base' 
            placeholder='Описание' />

      <div className="my-2 sm:my-3 text-white">
          <h3 className="mb-2 text-sm sm:text-base font-medium">Выбор приватности</h3>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm sm:text-base">
              <div className="flex items-center">
                  <input type="radio" id="closed" name="check" className="h-4 w-4"/>
                  <label htmlFor="closed" className="ml-2">Закрытый</label>
              </div>
              
              <div className="flex items-center">
                  <input type="radio" id="global" name="check" className="h-4 w-4 ml-0 sm:ml-3"/>
                  <label htmlFor="global" className="ml-2">Глобальный</label>
              </div>
          </div>
      </div>
      
      <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 mt-1'>
          <button className='text-white font-semibold bg-blue-600 hover:bg-blue-700 
                        transition-colors duration-300 shadow-md focus:outline-none 
                        focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                        py-1.5 sm:py-2 px-4 rounded-sm text-sm sm:text-base flex-1 text-center'>
              Сохранить
          </button>
          <button className='text-white font-semibold bg-red-600 hover:bg-red-700 
                        transition-colors duration-300 shadow-md focus:outline-none 
                        focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                        py-1.5 sm:py-2 px-4 rounded-sm text-sm sm:text-base flex-1 text-center'>
              Удалить
          </button>
      </div>
  </div>
  );
}