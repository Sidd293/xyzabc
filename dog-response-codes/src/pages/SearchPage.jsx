import React, { useState } from 'react'
import { DOG_IMAGES } from '../data/dogImages'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const SearchPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('')
  const [filteredImages, setFilteredImages] = useState([])

  // Filter dog images based on response code pattern
  const handleFilterChange = (value) => {
    setFilter(value)
    
    // Convert filter to regex pattern
    const pattern = value.replace('x', '.')
    const regex = new RegExp(`^${pattern}`)

    const filtered = DOG_IMAGES.filter(img => 
      value ? regex.test(img.responseCode) : false
    )
    
    setFilteredImages(filtered)
  }

  const handleSaveList = async () => {
    // Prompt for list name
    const listName = prompt('Enter a name for this list:')
    if (!listName) return

    // Insert list into Supabase
    const { error } = await supabase
      .from('user_lists')
      .insert({
        user_id: user.id,
        name: listName,
        response_codes: filteredImages.map(img => img.responseCode),
        image_links: filteredImages.map(img => img.url),
        created_at: new Date()
      })

    if (error) {
      console.error('Error saving list:', error)
      alert('Failed to save list')
    } else {
      alert('List saved successfully!')
      navigate('/lists')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Dog Images by Response Code</h1>
      
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Filter by response code (e.g., 2xx, 20x, 203)" 
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <p className="text-sm text-gray-600 mt-1">
          Use 'x' as a wildcard. Examples: 2xx, 20x, 21x
        </p>
      </div>

      {filteredImages.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map(image => (
              <div key={image.id} className="border p-2 rounded">
                <img 
                  src={image.url} 
                  alt={`Dog with response code ${image.responseCode}`} 
                  className="w-full h-48 object-cover rounded"
                />
                <p className="text-center mt-2">
                  Response Code: {image.responseCode}
                </p>
              </div>
            ))}
          </div>
          <button 
            onClick={handleSaveList}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save Current List
          </button>
        </>
      ) : (
        <p className="text-gray-500 text-center">
          {filter ? 'No images found for the current filter' : 'Enter a response code to filter'}
        </p>
      )}
    </div>
  )
}

export default SearchPage