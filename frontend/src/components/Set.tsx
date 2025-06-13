import Link from 'next/link';
import React from 'react'
import { SetWithCards } from '@/lib/api';

export const Set: React.FC<SetWithCards> = ({ ...data }) => {
  return (
    <Link
        key={data.id}
        href={`/set/${data.id}`}
        className="
          bg-black bg-opacity-90 shadow-2xl text-white
          transform transition-transform duration-500 hover:scale-105
          hover:border-b-4 hover:border-b-blue-500
          border border-gray-700 p-4 rounded-md cursor-pointer
          h-auto min-h-[6rem]
          flex flex-col justify-between
          sm:p-3 sm:min-h-[5.5rem]
          md:p-4 md:min-h-[6rem]
          lg:p-5 lg:min-h-[7rem]
        "
      >
        <h2 className="text-lg sm:text-base md:text-lg lg:text-xl font-semibold">{data.name}</h2>

        <p className="text-sm sm:text-[9] md:text-sm lg:text-base whitespace-nowrap">Карточек: {data._count.Cards}</p>
    </Link>
  )
}