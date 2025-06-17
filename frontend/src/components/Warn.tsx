import React from "react";

interface WarnProps {
    text: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const Warn: React.FC<WarnProps> = ({ text, onConfirm, onCancel }) => {
    return (
    <div className="absolute flex justify-center items-center z-10 bg-[#0000005a] w-full h-full">
        <div className='bg-black p-10 text-white'>
            <h2 className='my-2 font-bold'>Предупреждение</h2>

            <p className='my-3'>{text}</p>

            <div className="flex justify-between min-w-70">
                <button onClick={onConfirm} className='py-1 px-10 font-semibold text-white bg-blue-600 rounded-sm
                        hover:bg-blue-700 transition-colors shadow-md show-on-small
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 duration-300"'>Да</button>
                <button onClick={onCancel} className='text-white font-semibold bg-red-600 hover:bg-red-700 
                                    transition-colors duration-300 shadow-md focus:outline-none 
                                    focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                                    py-1 sm:py-2 px-10 rounded-sm text-sm sm:text-base
                                    disabled:opacity-50 disabled:cursor-not-allowed'>Нет</button>
            </div>
        </div>
    </div>
  );
}

export default Warn;