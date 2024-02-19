import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;
const db = new pg.Client({
  user:"postgres",
  host: "localhost",
  database: "permalist",
  password: "brother",
  port: 5437
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try {
    const items = await db.query("SELECT * FROM items ORDER BY id ASC;");
    console.log(typeof(items.rows));
    console.log(items.rows);
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items.rows,
    });
  } catch (error) {
    console.error(error);
  }
});

app.post("/add", async (req, res) => {
  try {
    const item = req.body.newItem;
    const addItem = await db.query("INSERT INTO items (title) VALUES ($1) RETURNING *;",[item]);
    items.push({ title: item }); 
    console.log(addItem.rows);
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});

app.post("/edit", async (req, res) => {
  try {
    console.log(req.body);
    const newTitle = req.body.updatedItemTitle;
    const newId = req.body.updatedItemId;
    const updatedItem = await db.query("UPDATE items SET title = $1 WHERE id = $2 RETURNING *",[newTitle, newId]);
    console.log(updatedItem.rows);
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});

app.post("/delete", async (req, res) => {
  try {
    const itemId = req.body.deleteItemId;
    const deleteItem = await db.query("DELETE FROM items WHERE id = $1;",[itemId]);
    console.log(deleteItem.rows);
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
