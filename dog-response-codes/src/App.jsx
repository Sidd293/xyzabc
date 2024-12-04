// src/App.jsx
import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import SearchPage from './pages/SearchPage'
import ListsPage from './pages/ListsPage'

// Navigation Component
const Navigation = () => {
  const { user, signOut } = useAuth()

  if (!user) return null

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/search" className="hover:text-gray-300">Search</Link>
          <Link to="/lists" className="hover:text-gray-300">My Lists</Link>
        </div>
        <div className="flex items-center space-x-4">
          <span>{user.email}</span>
          <button 
            onClick={signOut}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/lists" element={<ListsPage />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App