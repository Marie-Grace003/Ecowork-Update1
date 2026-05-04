import { useState } from 'react'
import { STORAGE_URL } from '../services/api'
import { useLowCarbon } from '../contexts/LowCarbonContext'

export default function PhotoCarousel({ photos, nom }) {
    const [current, setCurrent] = useState(0)
    const { lowCarbon } = useLowCarbon()

    // Mode Low Carbon : pas d'images
    if (lowCarbon) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-green-50 text-green-600 gap-1">
                <span className="text-2xl">🌿</span>
                <p className="text-xs font-medium">Mode Low Carbon</p>
                <p className="text-xs text-green-400">Images désactivées</p>
            </div>
        )
    }

    if (!photos || photos.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
                <i className="bi bi-building text-4xl"></i>
            </div>
        )
    }

    const prev = (e) => {
        e.stopPropagation()
        setCurrent((c) => (c === 0 ? photos.length - 1 : c - 1))
    }

    const next = (e) => {
        e.stopPropagation()
        setCurrent((c) => (c === photos.length - 1 ? 0 : c + 1))
    }

    return (
        <div className="relative w-full h-full group">
            <img
                src={`${STORAGE_URL}/${photos[current].chemin}`}
                alt={nom}
                className="w-full h-full object-cover transition-opacity duration-300"
                loading="lazy"
            />
            {photos.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                        <i className="bi bi-chevron-left text-xs"></i>
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                        <i className="bi bi-chevron-right text-xs"></i>
                    </button>
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                        {photos.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white w-3' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
