import { createContext, useContext, useState, useEffect } from 'react'

const LowCarbonContext = createContext()

export function LowCarbonProvider({ children }) {
    const [lowCarbon, setLowCarbon] = useState(() => {
        return localStorage.getItem('lowCarbon') === 'true'
    })

    useEffect(() => {
        localStorage.setItem('lowCarbon', lowCarbon)
        if (lowCarbon) {
            document.body.classList.add('low-carbon')
        } else {
            document.body.classList.remove('low-carbon')
        }
    }, [lowCarbon])

    const toggle = () => setLowCarbon(prev => !prev)

    return (
        <LowCarbonContext.Provider value={{ lowCarbon, toggle }}>
            {children}
        </LowCarbonContext.Provider>
    )
}

export function useLowCarbon() {
    return useContext(LowCarbonContext)
}
