import React, { useState, useEffect, useRef } from 'react'
import { SendOutlined } from '@ant-design/icons'
import NavBar from '../NavBar/NavBar'
import './MainPage.css'

const MainPage = () => {
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState('')
  const [refreshPosts, setRefreshPosts] = useState(false)
  const [user] = useState(JSON.parse(localStorage.getItem('user')) || {})
  const [selectedPost, setSelectedPost] = useState(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    fetch('http://localhost:3004/getAllPosts')
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.error(error))
  }, [refreshPosts]);

  const handlePostSubmit = () => {
    if (!newPost.trim()) {
      alert('Напишите что-то')
      return
    }
    const user = JSON.parse(localStorage.getItem('user'))
    fetch('http://localhost:3004/addPost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newPost, user }),
    })
      .then(response => response.json())
      .then(data => {
        setPosts([...posts, data])
        setNewPost('')
      })
      .catch(error => console.error(error))
    setNewPost('')
    textareaRef.current.style.height = 'auto'
  }

  const handleDeletePost = async (postId) => {
    const response = await fetch(`http://localhost:3004/deletePost/${postId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      console.error('Ошибка при удалении поста')
      return
    }
    setRefreshPosts(!refreshPosts)
  }

  const handlePostClick = (postId) => {
    setSelectedPost(selectedPost === postId ? null : postId)
  }

  useEffect(() => {
    const textarea = textareaRef.current
    const resizeTextarea = () => {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
    textarea.addEventListener('input', resizeTextarea)
    return () => {
      textarea.removeEventListener('input', resizeTextarea)
    }
  }, [])
  return (
    <div>
      <NavBar />
      <div id="mainPageBg"></div>
      <div id='posts'>
        <textarea
          ref={textareaRef}
          id="textarea"
          placeholder='Что у вас нового?'
          value={newPost}
          onChange={e => setNewPost(e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handlePostSubmit()
            }
          }}
        />
        <button id='postsBtn' onClick={handlePostSubmit}><SendOutlined /></button>
        {[...posts].reverse().map(post => (
          <div id='postsInfo' key={post.id}>
            <div><img id='postsAvatar' src={post.avatar || 'http://localhost:3004/uploads/defaultAvatar.png'} alt="Аватар" /></div>
            <div id='postsUserName'>{post.name}</div>
            <div id='postsText' onClick={() => handlePostClick(post.id)}>{post.text}</div>
            {post.name === user.regUsername && post.id === selectedPost && (
              <button id='delPost' onClick={() => handleDeletePost(post.id)}>Удалить</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPage;