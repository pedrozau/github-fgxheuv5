'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Search } from 'lucide-react'
import { LatLng } from 'leaflet'

interface SearchResult {
  display_name: string
  lat: string
  lon: string
}

interface MapSearchProps {
  onLocationSelect: (position: LatLng) => void
}

export default function MapSearch({ onLocationSelect }: MapSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const searchLocation = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + ', Angola'
        )}&limit=5`
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setResults(data)
      setShowResults(true)
    } catch (error) {
      console.error('Error searching location:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        searchLocation(query)
      } else {
        setResults([])
        setShowResults(false)
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [query, searchLocation])

  const handleSelect = (result: SearchResult) => {
    const position = new LatLng(parseFloat(result.lat), parseFloat(result.lon))
    onLocationSelect(position)
    setQuery(result.display_name)
    setShowResults(false)
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar endereço..."
            className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={() => searchLocation(query)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      {(showResults && results.length > 0) && (
        <div className="relative z-50 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleSelect(result)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              <p className="text-sm text-gray-900 truncate">{result.display_name}</p>
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="absolute right-12 top-1/2 -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
        </div>
      )}
    </div>
  )
}

