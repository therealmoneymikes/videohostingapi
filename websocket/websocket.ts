import{Server} from "socket.io"
import { createServer } from "http"
import express from "express"
import Redis from "ioredis"
import { ClientToServerActions, ServerToCiientActions } from "./websocketactions"







const app = express()
const httpServer = createServer(app)
const io = new Server<ClientToServerActions, ServerToCiientActions>(httpServer, {cors: {origin: "*"}});



io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`)


    socket.on("joinRoom", (roomId) => {
        socket.join(roomId); //Allow user to join the room via roomId
        console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    socket.on("message", (data) => {
        const {roomId, message} = data;
        io.to(roomId).emit("message", ({sender: socket.id, message, roomId}))
    })

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`)
    })
})