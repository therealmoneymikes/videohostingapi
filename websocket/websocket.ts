import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import Redis from "ioredis";
import {
  ClientToServerActions,
  ServerToCiientActions,
} from "./websocketactions";

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerActions, ServerToCiientActions>(
  httpServer,
  { cors: { origin: "*" } }
);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("offer", (data) => {
    if (data.target) {
      socket.to(data.target).emit("offer", data);
    } else {
      console.log("Offer event received but target is missing");
    }
  });

  socket.on("answer", (data) => {
    if (data.target) {
      socket.to(data.target).emit("answer", data);
    } else {
      console.log("Offer event received but target is missing");
    }
  });

  socket.on("iceCandidate", (data) => {
    if (data.target) {
      socket.to(data.target).emit("iceCandidate", data);
    } else {
      console.log("Offer event received but target is missing");
    }
  });
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId); //Allow user to join the room via roomId
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on("message", (data) => {
    const { roomId, message } = data;
    if (!roomId || !message) {
      console.error("Message event received with invalid data.");
      return;
    }
    io.to(roomId).emit("message", { sender: socket.id, message, roomId });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    const rooms = Object.keys(socket.rooms);
    rooms.forEach((room) => {
      console.log(`User ${socket.id} left room: ${room}`);
    });
  });
});
