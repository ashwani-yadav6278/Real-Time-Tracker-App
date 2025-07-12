const express=require("express");
const app=express();
const socketio=require("socket.io");
const http=require('http');
const path=require('path');
const ejs=require("ejs");

const env=require('dotenv');
env.config();
const PORT=process.env.PORT || 5000;

const server=http.createServer(app);

const io=socketio(server);
app.set("view engine",ejs);
app.use(express.static(path.join(__dirname,"public")));

io.on("connection",(socket)=>{
    
    socket.on("send-location",(data)=>{
        io.emit("receive-location",{id:socket.id,...data})
    })
    console.log("a user connected");
    
    socket.on("disconnect",()=>{
        io.emit("user-disconnected",socket.id)
        console.log("a user disconnected");
    })
})

app.get("/",(req,res)=>{
    res.render("index.ejs");
})

server.listen(PORT,()=>{
    console.log("Server is running on port: ",PORT);
})