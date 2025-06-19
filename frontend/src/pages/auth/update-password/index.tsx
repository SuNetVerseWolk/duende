// app/auth/update-password/page.tsx
"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if the user has followed a password recovery link
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        // User has followed a password recovery link
      }
    })
  }, [])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.updateUser({
        password
      })

      if (error) throw error
      
      setMessage('Password updated successfully!')
      router.push('/')
    } catch (error) {
      setMessage((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center w-full">
      <div className='bg-black bg-opacity-90 shadow-2xl text-white
               transform transition-transform duration-500
               border border-gray-700 sm:p-3 md:p-4 rounded-xl
               w-full max-w-md mx-auto p-8 mt-15'>
        <h1 className="text-2xl font-bold mb-4">Обновить пароль</h1>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="password" className="block mb-1">Новый пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder='Введите новый пароль'
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded
                          focus:border-white focus:ring focus:ring-white focus:outline-none
                          transition-colors duration-300"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded
                        hover:bg-blue-700 transition-colors duration-300 shadow-md
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? 'Обновляется...' : 'Обновление пароля'}
          </button>
        </form>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  )
}