import React, { useContext } from 'react'
import logo from '../assets/logo-gradpath.png'
import DarkLogo from '../assets/Dark-logo.png'
import ThemeContext from '../context/ThemeContext.jsx'


const Header = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext)

  return (
    <header className="sticky w-full text-center mt-6">
      <div className="relative">
        <img src={isDark ? DarkLogo : logo} alt="LOGO" className="w-[300px] mx-auto" />
        <button
          onClick={toggleTheme}
          className="absolute top-0 right-4 p-2 rounded-full hover:bg-black-200 dark:hover:bg-black-700 transition-colors"
        >
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}


export default Header
