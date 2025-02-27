import React from 'react'
import logo from '../assets/Dark-logo.png'

const Header = () => {
  return (
    <header className=" sticky w-full text-center bg-black  ">
        <img src={logo} alt="LOGO"  className='w-xs'/>
      </header>
  )
}

export default Header