import { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { useLowCarbon } from '../../../contexts/LowCarbonContext'
import logo from '../../../assets/logo.svg'

export default function Header() {
    const { user, logout, isAdmin } = useAuth()
    const { lowCarbon, toggle } = useLowCarbon()
    const navigate = useNavigate()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const dropdownRef = useRef(null)

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const adminLinks = [
        { path: '/admin/dashboard', label: 'Dashboard' },
        { path: '/admin/users', label: 'Utilisateurs' },
        { path: '/admin/espaces', label: 'Espaces' },
        { path: '/admin/reservations', label: 'Réservations' },
    ]

    const userLinks = [
        { path: '/dashboard', label: 'Accueil' },
        { path: '/espaces', label: 'Espaces' },
        { path: '/reservations', label: 'Mes réservations' },
    ]

    const links = isAdmin() ? adminLinks : userLinks

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const [visible, setVisible] = useState(true)
    const timeoutRef = useRef(null)

    useEffect(() => {
        const handleScroll = () => {
            setVisible(true)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(() => {
                if (window.scrollY > 0) {
                    setVisible(false)
                }
            }, 2000)
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    return (
        <header className={`bg-white border-b border-gray-100 px-6 py-3 sticky top-0 z-40 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                <div className="flex items-center gap-2">
                    <img src={logo} alt="EcoWork" className="w-10 h-10 object-contain" />
                    <span className="font-bold text-gray-800 text-lg">EcoWork</span>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-2">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? 'text-white'
                                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                }`
                            }
                            style={({ isActive }) => isActive ? {
                                background: 'linear-gradient(to right, #7BDFF2, #7BDFF2, #B2F7EF)'
                            } : {}}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-3">

                    {/* Toggle Low Carbon */}
                    <button
                        onClick={toggle}
                        title={lowCarbon ? 'Désactiver le mode Low Carbon' : 'Activer le mode Low Carbon'}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                            lowCarbon
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-green-50 hover:text-green-600 hover:border-green-200'
                        }`}
                    >
                        <span className="text-base">🌿</span>
                        <span className="hidden lg:block">{lowCarbon ? 'Low Carbon ON' : 'Low Carbon'}</span>
                        <div className={`w-8 h-4 rounded-full transition-all relative ${lowCarbon ? 'bg-green-400' : 'bg-gray-200'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${lowCarbon ? 'left-4' : 'left-0.5'}`}></div>
                        </div>
                    </button>

                    {/* Dropdown utilisateur */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                        >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                style={{ background: 'linear-gradient(to right, #7BDFF2, #B2F7EF)' }}
                            >
                                {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-gray-700 hidden md:block">
                                {user?.prenom} {user?.nom}
                            </span>
                            <svg className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
                                <button
                                    onClick={() => { navigate(isAdmin() ? '/admin/profil' : '/profil'); setDropdownOpen(false) }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-eco-light transition-all flex items-center gap-2"
                                >
                                    <i className="bi bi-person"></i>
                                    Mon profil
                                </button>
                                <hr className="my-1 border-gray-100" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-all flex items-center gap-2"
                                >
                                    <i className="bi bi-box-arrow-right"></i>
                                    Déconnexion
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bouton hamburger mobile */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 rounded-xl hover:bg-gray-50 transition-all"
                >
                    <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'} text-xl text-gray-600`}></i>
                </button>
            </div>

            {/* Menu mobile */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 pt-4 pb-2 mt-3 space-y-1">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? 'text-white'
                                    : 'text-gray-500 hover:bg-gray-50'
                                }`
                            }
                            style={({ isActive }) => isActive ? {
                                background: 'linear-gradient(to right, #7BDFF2, #B2F7EF)'
                            } : {}}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                    <hr className="border-gray-100 my-2" />

                    {/* Toggle Low Carbon mobile */}
                    <button
                        onClick={toggle}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            lowCarbon ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <span>🌿</span>
                        <span>Mode Low Carbon</span>
                        <div className={`ml-auto w-8 h-4 rounded-full transition-all relative ${lowCarbon ? 'bg-green-400' : 'bg-gray-200'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${lowCarbon ? 'left-4' : 'left-0.5'}`}></div>
                        </div>
                    </button>

                    <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                            style={{ background: 'linear-gradient(to right, #7BDFF2, #B2F7EF)' }}
                        >
                            {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                            {user?.prenom} {user?.nom}
                        </span>
                    </div>
                    <button
                        onClick={() => { navigate(isAdmin() ? '/admin/profil' : '/profil'); setMobileMenuOpen(false) }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-eco-light transition-all flex items-center gap-2 rounded-xl"
                    >
                        <i className="bi bi-person"></i>
                        Mon profil
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-all flex items-center gap-2 rounded-xl"
                    >
                        <i className="bi bi-box-arrow-right"></i>
                        Déconnexion
                    </button>
                </div>
            )}
        </header>
    )
}
