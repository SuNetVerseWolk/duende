import Link from 'next/link';
import React from 'react'
import { SetWithCount, GroupedSetsResponse } from '@/lib/api';

export const Set: React.FC<SetWithCount> = ({ ...data }) => {
  return (
    <Link href="/cardsPage" className='bg-black bg-opacity-90 shadow-2xl text-white
                      transform transition-transform duration-500 hover:scale-105
                      hover:border-b-4 hover:border-b-blue-500
                      border border-gray-700" p-2.5 rounded-md w-50 h-25 cursor-pointer'>
        <h2>{data.name}</h2>
        <p>{data._count.Cards}</p>
    </Link>
  )
}