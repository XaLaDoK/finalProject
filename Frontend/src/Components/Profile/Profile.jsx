import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../NavBar/NavBar'
import './Profile.css'

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileUrl, setFileUrl] = useState('')

  const fileSelectedHandler = event => {
    setSelectedFile(event.target.files[0])
  }

  const fileUploadHandler = () => {
    const formData = new FormData()
    formData.append('avatar', selectedFile)
    formData.append('userId', user.userId)
    fetch('http://localhost:3004/uploadAvatar', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        const avatarUrl = `http://localhost:3004/uploads/${data.file.filename}`
        setFileUrl(avatarUrl)
        user.avatar = avatarUrl
        localStorage.setItem('user', JSON.stringify(user))
        setSelectedFile(null)
      })
      .catch(error => console.error(error))
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    setFileUrl(user.avatar)
  }, [])

  return (
    <div>
      <NavBar />
      <div id='profileBg'></div>
      <div id='profileInfo'>
        {fileUrl ? (
          <img id='avatar' src={fileUrl} alt="avatar" onClick={() => document.getElementById('fileInput').click()} />
        ) : (
          <button onClick={() => document.getElementById('fileInput').click()}>Выберите файл</button>
        )}
        <input id="fileInput" type="file" onChange={fileSelectedHandler} style={{ display: 'none' }} />
        {selectedFile && <button id='uploadBtn' onClick={fileUploadHandler}>Загрузить</button>}
        <div id='userName'>{user.regUsername}</div>
        <div className='profileInfoText'>Почта: {user.regEmail}</div>
        <div className='profileInfoText'>Возраст: {user.age}</div>
        <div className='profileInfoText'>Пол: {user.selected}</div>
        <Link className='link' id='exit' to={'/'}>Выйти</Link>
      </div>
    </div>
  )
}