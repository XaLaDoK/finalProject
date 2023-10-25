// const sqlite3 = require('sqlite3').verbose()
// const db = new sqlite3.Database('DBPosts')

// db.serialize(() => {
//     db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, password TEXT)")
//     db.run("CREATE TABLE posts (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INT, text TEXT, FOREIGN KEY (user_id) REFERENCES users (id))")

//     db.run("INSERT INTO users(name,password) VALUES('alex','333')")
//     db.run("INSERT INTO users(name,password) VALUES('sasha','33113')")

//     db.run("INSERT INTO posts(user_id,text) VALUES(1,'Я сегодня иду гулять по Москве')")
//     db.run("INSERT INTO posts(user_id,text) VALUES(2,'Круто я с тобой')")
// })

// db.close()