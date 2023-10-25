const express = require('express')
const app = express()
const PORT = 3004
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('DBPosts')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

app.use(bodyParser.json())
app.use(cors())

const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir)
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
})
const upload = multer({ storage: storage })

app.post('/uploadAvatar', upload.single('avatar'), (req, res) => {
    const filename = req.file.filename
    const userId = req.body.userId
    const sql = `UPDATE users SET avatar = ? WHERE id = ?`
    db.run(sql, [filename, userId], function (err) {
        if (err) {
            return console.error(err.message)
        }
        res.status(200).json({
            message: 'Аватар успешно загружен',
            file: req.file
        })
    })
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/defaultAvatar.png', express.static(path.join(__dirname, 'defaultAvatar.png')))

db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, password TEXT, email TEXT, age INT, gender TEXT, avatar TEXT)")
    db.run("CREATE TABLE posts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, user_id INT, text TEXT, avatar TEXT, FOREIGN KEY (user_id) REFERENCES users (id))")
})

app.get('/getAllUsers', (req, res) => {
    db.all("SELECT * FROM users", (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.json(data)
        }
    })
})

app.get('/getAllPosts', (req, res) => {
    db.all("SELECT * FROM posts", (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.json(data)
        }
    })
})

app.post('/addUser', (req, res) => {
    const { regUsername, regEmail, age, regPassword, ConfPassword, selected } = req.body
    const defaultAvatar = 'defaultAvatar.png'
    if (regPassword !== ConfPassword) {
        return res.status(400).send('Пароли не совпадают')
    }
    const sql = `SELECT * FROM users WHERE email=? OR name=?`
    db.all(sql, [regEmail, regUsername], (err, data) => {
        if (err) {
            console.error(err)
            return res.status(500).send(err)
        }
        if (data.length) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].name === regUsername) {
                    return res.status(400).send('Такой пользователь уже существует')
                }
                if (data[i].email === regEmail) {
                    return res.status(400).send('Этот адрес электронной почты уже используется')
                }
            }
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(regPassword, salt)
        db.run(`INSERT INTO users (name,email,age,password,gender,avatar) VALUES(?,?,?,?,?,?)`, [regUsername, regEmail, age, hash, selected, defaultAvatar], function (err) {
            if (err) {
                console.error(err)
                return res.status(500).send(err)
            }
            db.get("SELECT users.id, name FROM users WHERE name=?", regUsername, (err, data) => {
                if (err) {
                    console.error(err)
                    return res.status(500).send(err)
                }
                return res.json(data)
            })
        })
    })
})

app.post('/checkUser', (req, res) => {
    const { username, password } = req.body
    const sql = `SELECT * FROM users WHERE name = ?`
    db.get(sql, [username], (err, data) => {
        if (err) {
            console.error(err)
            return res.status(500).send(err)
        }
        if (data) {
            if (bcrypt.compareSync(password, data.password)) {
                const avatarUrl = `http://localhost:3004/uploads/${data.avatar}`
                return res.json({ userId: data.id, regUsername: data.name, regEmail: data.email, age: data.age, selected: data.gender, avatar: avatarUrl })
            }
        }
        res.status(401).send('Неверный логин или пароль')
    })
})

app.post('/addPost', (req, res) => {
    const { text, user } = req.body
    const { regUsername: name, avatar } = user
    db.run(`INSERT INTO posts (name, text, avatar) VALUES(?,?,?)`, [name, text, avatar], function (err) {
        if (err) {
            console.error(err)
            return res.status(500).send(err)
        }
        db.get("SELECT * FROM posts WHERE id=?", this.lastID, (err, data) => {
            if (err) {
                console.error(err)
                return res.status(500).send(err)
            }
            return res.json(data)
        })
    })
})

app.delete('/deletePost/:id', (req, res) => {
    const { id } = req.params
    db.run(`DELETE FROM posts WHERE id = ?`, id, function (err) {
        if (err) {
            console.error(err)
            return res.status(500).send(err)
        }
        return res.json({ id })
    })
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})