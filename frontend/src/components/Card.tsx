const Card = () => {
  return(
    <div className='bg-black bg-opacity-90 shadow-2xl text-white
               transform transition-transform duration-500
               border border-gray-700 p-2 sm:p-3 md:p-4 rounded-md
               w-full max-w-md mx-auto'>
        <input type="text" 
            className="w-full px-3 sm:px-4 py-2 text-white bg-gray-700 border-b border-b-gray-600
                        focus:border-b-white placeholder-gray-400
                        transition-colors duration-300 text-sm sm:text-base" 
            placeholder="Текст" />
        <input type="text" 
            className="w-full px-3 sm:px-4 py-2 text-white bg-gray-700 border-b border-b-gray-600
                        focus:border-b-white placeholder-gray-400
                        transition-colors duration-300 text-sm sm:text-base mt-2" 
            placeholder="Перевод" />
        
        <div className="flex gap-2 mt-3 sm:mt-4">
            <button className='text-white font-semibold bg-red-900 text-sm sm:text-base
                        hover:bg-red-700 transition-colors duration-300 shadow-md
                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                        py-1 px-2 sm:py-1.5 sm:w-20 rounded-sm flex-1 sm:flex-none'>Удалить</button>
            <button className='text-white font-semibold bg-black border text-sm sm:text-base
                        hover:bg-white hover:text-black transition-colors duration-300 shadow-md
                        py-1 px-2 sm:py-1.5 sm:w-10 rounded-sm flex-1 sm:flex-none'>Ai</button>
        </div>
    </div>
  );
}

export default Card