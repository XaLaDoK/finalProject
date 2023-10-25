import React from 'react'
import { Link } from 'react-router-dom'
import './NavBar.css'

export default function NavBar() {
  return (
    <div className='navBar'>
      <li className='exclude'>
        <Link className='link' to={'/MainPage'}>
          <img id='logo' src="https://psv4.userapi.com/c237231/u254212014/docs/d11/45c4a85b6c30/6575171.png?extra=8ZaPbyX8X9XhIXDYcU0Zqv-2oZll38ZaYUi47RSRJifCvIjjl7thWjgY7QpoRz-Z0AgNztIPZST51S5QH2L1X4WtNw0cMAl8RrXIGqCpamOQBHK5FvefGs9rDRpEUzwp0SII_6ofURj5X2D3ese7RaSDzg" alt="logo" />
          <div id='name'>Danzel</div>
        </Link>
      </li>
      <li><Link className='link' to={'/Profile'}>Мой профиль</Link></li>
      <li><Link className='link' to={'/MainPage'}>Главная страница</Link></li>
      <li><Link className='link' to={'/Users'}>Пользователи</Link></li>
    </div>
  )
}