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
    password: "123456",
    timestamp: new Date().toLocaleString(),
    location: "Location not provided",
    likes: 0,
  },
  {
    id: uuidv4(),
    username: "Zameer",
    content: "beshak sahi hai",
    password: "123456",
    timestamp: new Date().toLocaleString(),
    location: "Location not provided",
    likes: 0,
  },
];

//--------Home page URL
app.get("/posts", (req, res) => {
  res.render("index", { posts });
});

//--------------------------------------------------------------------------------------Create Post Page (GET/POST)---------------------------------------------------

app.get("/posts/new", (req, res) => {
  res.render("new"); //--------err
});

app.get("/posts/explore",(req,res)=>{
  const shuffledPosts = [...posts].sort(() => Math.random() - 0.5); // Shuffle posts
  res.render("explore",{ posts: shuffledPosts });
});

app.get("/posts/about",(req,res)=>{
  res.render("about");
});

//-------return back to home page
app.post("/posts", async (req, res) => {
  let { username, content, password, location: userLocation } = req.body;
  let id = uuidv4();
  const timestamp = new Date().toLocaleString();
  const likes = 0;
  const location = userLocation || "Location not provided";
  posts.push({ id, username, content, password, timestamp, location, likes });
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

app.post("/posts/:id/like", (req, res) => {
  const id = req.params.id;
  const post = posts.find((post) => post.id === id);
  if (post) {
    post.likes += 1;
    res.status(200).send({ likes: post.likes });
  } else {
    res.status(200).send({ error: "Post not found" });
  }
});

// app.put("/posts/:id", (req, res) => {
//   let { id } = req.params;
//   let newContent = req.body.content;
//   let post = posts.find((p) => id === p.id);
//   if (post.password === password) {
//     // If password matches, delete the post
//     post.content = newContent;
//     res.redirect("/posts");
//   } else {
//     // If password is incorrect
//     res.render("index", {
//       posts,
//       error: "Incorrect password. Post not deleted.",
//     });
//   }
//   // post.content = newContent;
//   // res.send("post updated");
//   // res.redirect("/posts");
//   // console.log(post);
// });

app.put("/posts/:id", (req, res) => {
  let { id } = req.params;
  let { content, password } = req.body;
  let post = posts.find((p) => id === p.id);

  if (!post) {
    return res.render("index", { posts, error: "Post not found." });
  }

  if (post.password === password) {
    post.content = content;
    res.redirect("/posts");
  } else {
    res.render("edit", {
      post,
      error: "Incorrect password. Edit not allowed.",
    });
  }
});

app.get("/posts/:id/edit", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => id === p.id);
  res.render("edit", { post });
});

// app.delete("/posts/:id", (req, res) => {
//   let { id } = req.params;
//   let {password}=req.body;
//   let pi = posts.findIndex((p) => id === p.id);
//  posts.splice(pi, 1);
//   res.redirect("/posts");
// });

app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  // Find the post by ID
  const postIndex = posts.findIndex((post) => post.id === id);

  if (postIndex === -1) {
    // If post not found
    return res.render("index", {
      posts,
      error: "Post not found.",
    });
  }

  const post = posts[postIndex];

  if (post.password === password) {
    // If password matches, delete the post
    posts.splice(postIndex, 1);
    res.redirect("/posts");
  } else {
    // If password is incorrect
    res.render("index", {
      posts,
      error: "Incorrect password. Post not deleted.",
    });
  }
});
