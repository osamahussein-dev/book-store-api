import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import booksRouter from "./routes/books.js";
import pgclient from "./db.js";

const app = express();
dotenv.config();
app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Test");
});

app.use("/api/books", booksRouter);

pgclient.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });
});
