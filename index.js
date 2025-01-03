import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

// Assign port and express
const app = express();
const port = 3000;

// Assign db and connect to it
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "___",
  port: 5432,
});
db.connect();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Initial items variable
let items = [];

// Query db for items
app.get("/", async (req, res) => {
  try { 
    const result = await db.query("SELECT * FROM items");
    items = result.rows;

    res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });

} catch(err) {
  console.log(err);
}
});

// Insert new items into DB
app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  items.push({ title: item });

  try {
    await db.query(
      "INSERT INTO items (title) VALUES ($1)",
      [item]
    );
    res.redirect("/");
    
  } catch (err) {
    console.log(err);
  }
});

// Edit name of items
app.post("/edit", async (req, res) => {

  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = ($2)", [item, id]);

    res.redirect("/");

  } catch(err) {
    console.log(err);
  }

});

// Delete item from list
app.post("/delete", async (req, res) => {
  const itemDelete = req.body.deleteItemId

  try {
    await db.query("DELETE FROM items WHERE id = ($1)", [itemDelete]);

    res.redirect("/");
    
  } catch(err) {
    console.log(err);
  }
});

// Log the port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
