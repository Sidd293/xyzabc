import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { DOG_IMAGES } from '../data/dogImages'

const ListsPage = () => {
  const { user } = useAuth()
  const [lists, setLists] = useState([])
  const [selectedList, setSelectedList] = useState(null)

  useEffect(() => {
    fetchUserLists()
  }, [user])

  const fetchUserLists = async () => {
    const { data, error } = await supabase
      .from('user_lists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching lists:', error)
    } else {
      setLists(data)
    }
  }

  const handleDeleteList = async (listId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this list?')
    if (confirmDelete) {
      const { error } = await supabase
        .from('user_lists')
        .delete()
        .eq('id', listId)

      if (error) {
        console.error('Error deleting list:', error)
      } else {
        fetchUserLists()
        setSelectedList(null)
      }
    }
  }

  const handleEditList = async (list) => {
    const newName = prompt('Enter new list name:', list.name)
    if (newName && newName.trim() !== '') {
      const { error } = await supabase
        .from('user_lists')
        .update({ name: newName.trim() })
        .eq('id', list.id)

      if (error) {
        console.error('Error updating list:', error)
      } else {
        fetchUserLists()
      }
    }
  }

  const getListImages = (list) => {
    return list.image_links.map(link => 
      DOG_IMAGES.find(img => img.url === link)
    ).filter(Boolean)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Saved Lists</h1>
      
      {lists.length === 0 ? (
        <p className="text-gray-500 text-center">
          You haven't saved any lists yet. Start searching and saving!
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {lists.map(list => (
            <div key={list.id} className="border rounded p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold">{list.name}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(list.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex space-x-2 mb-2">
                <button 
                  onClick={() => setSelectedList(selectedList?.id === list.id ? null : list)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  {selectedList?.id === list.id ? 'Hide Images' : 'View Images'}
                </button>
                <button 
                  onClick={() => handleEditList(list)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                >
                  Edit Name
                </button>
                <button 
                  onClick={() => handleDeleteList(list.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
              
              {selectedList?.id === list.id && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {getListImages(list).map(image => (
                    <div key={image.id} className="border rounded p-1">
                      <img 
                        src={image.url} 
                        alt={`Dog for ${image.responseCode}`} 
                        className="w-full h-24 object-cover rounded"
                      />
                      <p className="text-center text-xs mt-1">
                        Code: {image.responseCode}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ListsPage