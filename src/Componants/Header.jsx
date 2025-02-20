import React from 'react'
import logo from '../assets/logo-gradpath.png'

const Header = () => {
  return (
    <header className=" sticky w-full text-center mt-6 ">
        <img src={logo} alt="LOGO"  className='w-xs'/>
      </header>
  )
}

export default Header
