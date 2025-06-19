import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })

      if (error) throw error
      
      setMessage('Check your email for the password reset link!')
    } catch (error) {
      setMessage((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center w-full">
      <div className="bg-black bg-opacity-90 shadow-2xl text-white
               transform transition-transform duration-500
               border border-gray-700 sm:p-3 md:p-4 rounded-xl
               w-full max-w-md mx-auto p-8 mt-15">
        <h1 className="text-2xl font-bold mb-4">Забыл пароль</h1>
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder='Введите ваш Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {loading ? 'Отпровляется...' : 'Отправить ссылку'}
          </button>
        </form>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  )
}