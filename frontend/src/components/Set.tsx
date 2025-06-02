import Link from 'next/link';
import React from 'react'
import { Sets } from '../../generated/prisma';
import { useCardsForSet } from '@/hooks/useCards';

export const Set: React.FC<Sets> = ({ ...data }) => {
	const { data: cards, isLoading } = useCardsForSet(data.id);

  return (
    <Link href="/cardsPage" className='bg-black bg-opacity-90 shadow-2xl text-white
                      transform transition-transform duration-500 hover:scale-105
                      hover:border-b-4 hover:border-b-blue-500
                      border border-gray-700" p-2.5 rounded-md w-50 h-25 cursor-pointer'>
        <h2>{data.name}</h2>
        <p>{isLoading ? "Считаем кол-во карточек" : `${cards?.length} карточек`}</p>
    </Link>
  )
}