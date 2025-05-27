import Link from 'next/link';
import React from 'react'

interface SetProps {
    id: number;
    name: string;
    amount: string;
    owner: string;
}

export const Set: React.FC<SetProps> = ({ id, name, amount, owner }) => {
  return (
    <Link href="/cardsPage" className='bg-black bg-opacity-90 shadow-2xl text-white
                      transform transition-transform duration-500 hover:scale-105
                      hover:border-b-4 hover:border-b-blue-500
                      border border-gray-700" p-2.5 rounded-md w-50 h-25 cursor-pointer'>
        <h2>{name}</h2>
        <p>{amount} cards</p>
    </Link>
  )
}