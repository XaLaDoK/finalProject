const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('DBPosts')

db.all("SELECT * FROM users",(err, data)=>{
    console.log(data)
})

db.all("SELECT posts.id,text,name FROM posts JOIN users ON posts.user_id=users.id",(err, data)=>{
    console.log(data)
})

db.run("INSERT INTO users(name,password) VALUES('Maria','Maa333')")