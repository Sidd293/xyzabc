import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const { user, signInWithGoogle } = useAuth()

  // If user is already logged in, redirect to search page
  if (user) {
    return <Navigate to="/search" />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            HTTP Dog Response Codes
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to explore and save dog images by HTTP response codes
          </p>
        </div>
        <div>
          <button
            onClick={signInWithGoogle}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage