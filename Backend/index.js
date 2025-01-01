const express = require("express");
const app = express();
const port = 3000;
//path for .html & .css
const path = require("path");

//----------this is a package to create a unique id to the post
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");

//to understand input from user side
app.use(express.urlencoded({ extended: true })); //--------URL input
app.use(express.json()); //------------JSON input
app.use(methodOverride("_method"));

//setting view engine foe views folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//setting path for public folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  //------port starts and listen to--------- GET POST PUT PUSH DELETE-----------
  console.log(`server is running on port ${port}`);
});

//--------------------------------------------------------------------------------------Home page  GET---------------------------------------------------

//-------let allows the data push & delete   but in const only we can push
let posts = [
  {
    id: uuidv4(),
    username: "Mohammad",
    content: "Allah bless all his belivers....",
  },
  {
    id: uuidv4(),
    username: "Zameer",
    content: "beshak sahi hai",
  },
];

//--------Home page URL
app.get("/posts", (req, res) => {
  res.render("main", { posts });
});

//--------------------------------------------------------------------------------------Create Post Page (GET/POST)---------------------------------------------------

app.get("/posts/new", (req, res) => {
  res.render("new");
});

//-------return back to home page
app.post("/posts", (req, res) => {
  let { username, content } = req.body;
  let id = uuidv4();
  posts.push({ id, username, content });
  //res.send(req.body);
  //--------redirect will go back to Home page
  res.redirect("/posts");
});

//--------------------------------------------------------------------------------------View Post Page  (GET)---------------------------------------------------

app.get("/posts/:id", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => id === p.id);
  res.render("show", { post });
});

//--------------------------------------------------------------------------------------Update Post Page---------------------------------------------------

app.put("/posts/:id", (req, res) => {
  let { id } = req.params;
  let newContent = req.body.content;
  let post = posts.find((p) => id === p.id);
  post.content = newContent;
  // res.send("post updated");
  res.redirect("/posts");
  // console.log(post);
});

app.get("/posts/:id/edit", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => id === p.id);
  res.render("edit", { post });
});

app.delete("/posts/:id", (req, res) => {
  let { id } = req.params;
  let pi = posts.findIndex((p) => id === p.id);
  posts.splice(pi, 1);
  res.redirect("/posts");
});
