import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Registration from './Components/Registration/Registration'
import MainPage from './Components/MainPage/MainPage'
import Profile from './Components/Profile/Profile'
import Users from './Components/Users/Users'

export default function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Registration/>} />
        <Route path="/mainPage" element={<MainPage/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/users" element={<Users/>}/>
      </Routes>
    </Router>
    </>
  )
}