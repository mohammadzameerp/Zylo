const express = require("express");
const app = express();
const port = 3000;
//path for .html & .css
const path = require("path");

//----------this is a package to create a unique id to the post
const { v4: uuidv4 } = require("uuid");

//to understand input from user side
app.use(express.urlencoded({ extended: true })); //--------URL input
app.use(express.json()); //------------JSON input

//setting view engine foe views folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//setting path for public folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  //------port starts and listen to--------- GET POST PUT PUSH DELETE-----------
  console.log(`server is running on port ${port}`);
});

//--------------------------------------------------------------------------------------Home page---------------------------------------------------

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
  res.render("index", { posts });
});

//--------------------------------------------------------------------------------------Create Post Page---------------------------------------------------

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

//--------------------------------------------------------------------------------------View Post Page---------------------------------------------------

app.get("/posts/:id", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => id === p.id);
  res.render("show", { post });
});
