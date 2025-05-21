import express from "express";
import pgclient from "../db.js";

const booksRouter = express.Router();

let booksArray = [
  { id: 1, title: "Book Title", author: "Author Name", year: 2024 },
];

// GET all books
booksRouter.get("/", async (req, res) => {
  const result = await pgclient.query("SELECT * FROM books;");
  const combinedBooks = booksArray.concat(result.rows);
  res.json(combinedBooks);
});

// GET book by id
booksRouter.get("/:id", async (req, res) => {
  const result = await pgclient.query("SELECT * FROM books WHERE id = $1", [
    req.params.id,
  ]);
  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.json(result.rows[0]);
});

// POST create new book
booksRouter.post("/", async (req, res) => {
  const { title, author, year } = req.body;
  const result = await pgclient.query(
    "INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING *",
    [title, author, year]
  );
  res.json(result.rows[0]);
});

// PUT update book by id
booksRouter.put("/:id", async (req, res) => {
  const { title, author, year } = req.body;
  const result = await pgclient.query(
    "UPDATE books SET title = $1, author = $2, year = $3 WHERE id = $4 RETURNING *",
    [title, author, year, req.params.id]
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.json(result.rows[0]);
});

// DELETE book by id
booksRouter.delete("/:id", async (req, res) => {
  const result = await pgclient.query(
    "DELETE FROM books WHERE id = $1 RETURNING *",
    [req.params.id]
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.json({ message: "Book deleted", book: result.rows[0] });
});

export default booksRouter;
