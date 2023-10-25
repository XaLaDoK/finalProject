import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import './Registration.css'

export default function Registration() {
  const [regBtn, setRegBtn] = useState('button1')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfPassword, setShowConfPassword] = useState(false)
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [regUsername, setRegUsername] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [ConfPassword, setConfPassword] = useState('')
  const [age, setAge] = useState('')
  const [avatar] = useState('http://localhost:3004/uploads/defaultAvatar.png')
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()
  const navigateToMainPage = () => {
    navigate('/MainPage')
  }
  const handleChange = (event) => {
    if (selected === event.target.value) {
      setSelected(null)
    } else {
      setSelected(event.target.value)
    }
  }
  const registerUser = async () => {
    if (!regUsername || !regEmail || !age || !regPassword || !ConfPassword || !selected) {
      alert('Пожалуйста, заполните все поля')
      return
    }
    if (regUsername.length < 3) {
      alert('Имя пользователя должно содержать более 3 символов')
      return
    }
    if (!regEmail.includes('@') || !regEmail.includes('.')) {
      alert('Пожалуйста, введите настоящий адрес электронной почты')
      return
    }
    const hasEnglishLetter = /[a-zA-Z]/
    if (!hasEnglishLetter.test(regEmail)) {
      alert('Пожалуйста, введите настоящий адрес электронной почты')
      return;
    }
    if (age < 6 || age > 100) {
      alert('Пожалуйста, введите настоящий возраст')
      return
    }
    if (regPassword.length < 8) {
      alert('Пароль должен содержать больше 8 символов')
      return
    }
    const hasNumber = /\d/
    if (!hasNumber.test(regPassword)) {
      alert('Пароль должен содержать хотя бы одну цифру')
      return
    }
    const hasUpperCase = /[A-ZА-Я]/
    if (!hasUpperCase.test(regPassword)) {
      alert('Пароль должен содержать хотя бы одну заглавную букву')
      return
    }
    const response = await fetch('http://localhost:3004/addUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        regUsername,
        regEmail,
        age,
        regPassword,
        ConfPassword,
        selected,
        avatar
      }),
    })
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      data.avatar = `http://localhost:3004/uploads/${data.avatar}`
      localStorage.setItem('user', JSON.stringify({
        regUsername,
        regEmail,
        age,
        selected,
        avatar
      }))
      navigateToMainPage()
    } else if (response.ok) {
      const data = await response.json()
      console.log(data)
      data.avatar = `http://localhost:3004/uploads/${data.avatar}`
      navigateToMainPage()
    } else {
      alert(await response.text())
    }
  }

  const loginUser = async () => {
    const response = await fetch('http://localhost:3004/checkUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password
      }),
    })
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      localStorage.setItem('user', JSON.stringify(data))
      navigateToMainPage()
    } else {
      alert(await response.text())
    }
  }

  return (
    <div id="registration">
      <img id='regBg' src="https://skillbox.ru/upload/setka_images/14090913032023_bd473197c461193ea9b6d317f4c236910d065887.png" alt='background' />
      <div id="border" className={regBtn}>
        <div id='welcome'>WELCOME</div>
        <img id='regLogo' src="https://psv4.userapi.com/c237231/u254212014/docs/d11/45c4a85b6c30/6575171.png?extra=8ZaPbyX8X9XhIXDYcU0Zqv-2oZll38ZaYUi47RSRJifCvIjjl7thWjgY7QpoRz-Z0AgNztIPZST51S5QH2L1X4WtNw0cMAl8RrXIGqCpamOQBHK5FvefGs9rDRpEUzwp0SII_6ofURj5X2D3ese7RaSDzg" alt="logo" />
        <div id='regBtns'>
          <button
            className={`regBtn ${regBtn === 'button1' ? 'active' : ''}`}
            onClick={() => setRegBtn('button1')}>Вход</button>
          <button
            className={`regBtn ${regBtn === 'button2' ? 'active' : ''}`}
            onClick={() => setRegBtn('button2')}>Регистрация</button>
        </div>
        {regBtn === 'button1' && (
          <div id='entery'>
            {
              <>
                <div className="input-container">
                  <input
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <label className={username ? 'active' : ''}>Имя пользователя</label>
                </div>
                <div className="input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label className={password ? 'active' : ''}>Пароль</label>
                  <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                  </span>
                </div>
                <button id='entryBtn' onClick={loginUser}>Войти</button>
              </>
            }
          </div>
        )}
        {regBtn === 'button2' && (
          <div id='reg'>
            {
              <>
                <div className="input-container">
                  <input
                    type='text'
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    required
                  />
                  <label className={regUsername ? 'active' : ''}>Имя пользователя</label>
                </div>
                <div className="input-container">
                  <input
                    type='email'
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                  <label className={regEmail ? 'active' : ''}>Электронная почта</label>
                </div>
                <div className="input-container">
                  <input
                    type='number'
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                  <label className={age ? 'active' : ''}>Возраст</label>
                </div>
                <div className="input-container">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                  <label className={regPassword ? 'active' : ''}>Пароль</label>
                  <span className="eye-icon" onClick={() => setShowRegPassword(!showRegPassword)}>
                    {showRegPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                  </span>
                </div>
                <div className="input-container">
                  <input
                    type={showConfPassword ? 'text' : 'password'}
                    value={ConfPassword}
                    onChange={(e) => setConfPassword(e.target.value)}
                    required
                  />
                  <label className={ConfPassword ? 'active' : ''}>Повторите пароль</label>
                  <span className="eye-icon" onClick={() => setShowConfPassword(!showConfPassword)}>
                    {showConfPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                  </span>
                </div>
                <div id='radioInput'>
                  <div></div>
                  <input
                    type="radio"
                    id="option1"
                    name="option"
                    value="Мужской"
                    checked={selected === 'Мужской'}
                    onChange={handleChange}
                  />
                  <label className='gender'>Мужской</label>
                  <input
                    type="radio"
                    id="option2"
                    name="option"
                    value="Женский"
                    checked={selected === 'Женский'}
                    onChange={handleChange}
                  />
                  <label className='gender'>Женский</label>
                </div>
                <button id='regBtn' onClick={registerUser}>Зарегистрироваться</button>
              </>
            }
          </div>
        )}
      </div>
    </div>
  )
}