import React from 'react'
import logo from '../assets/Dark-logo.png'

const Header = () => {
  return (
    <header className=" sticky w-full text-center ">
        <img src={logo} alt="LOGO"  className='w-[300px]'/>
      </header>
  )
}

export default Header