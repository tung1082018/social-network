import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { readdirSync } from "fs";

const morgan = require("morgan");
require("dotenv").config();

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-type"],
  },
});

// db
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB CONNECTION ERROR => ", err));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true })); // for sending form data
app.use(cors({ origin: [process.env.CLIENT_URL] }));

app.use(morgan("dev"));

// autoload routes
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

io.on("connect", (socket) => {
  socket.on("new-post", (newPost) => {
    // console.log("socketio new post =>", newPost);
    socket.broadcast.emit("new-post", newPost);
  });
});

const port = process.env.PORT || 8000;
http.listen(port, () => console.log(`Server running on port ${port}`));
