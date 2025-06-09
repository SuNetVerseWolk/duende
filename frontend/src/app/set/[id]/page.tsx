import Card from '@/components/Card'
import UserSetItem from '@/components/UserSetItem'
import React from 'react'

const page = () => {
	return (
		<div className="flex justify-center min-h-screen bg-gradient-to-r from-black via-[#1f2834] to-black px-4">
      <div className="w-lg h-100%">
        <UserSetItem />

        <div className="flex flex-col gap-2 bg-white/5 p-5 rounded-2xl my-5">
          <Card/>
          <Card/>
          <Card/>
          <Card/>
          <Card/>
        </div>
      </div>
    </div>
	)
}

export default page