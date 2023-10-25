import React, { useEffect, useState } from 'react'
import NavBar from '../NavBar/NavBar'
import './Users.css'

export default function Users() {
    const [users, setUsers] = useState([])
    useEffect(() => {
        fetch('http://localhost:3004/getAllUsers')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error(error))
    }, [])
    return (
        <div>
            <NavBar />
            <div id="usersBg"></div>
            <div id='allUsers'>
                {users.map(user => (
                    <div id='usersInfo' key={user.id}>
                        <img id='usersAvatar' src={`http://localhost:3004/uploads/${user.avatar}`} alt="Аватар" />
                        <div id='userName'>{user.name}</div>
                        <div>Почта: {user.email}</div>
                        <div>Возраст: {user.age}</div>
                        <div>Пол: {user.gender}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}