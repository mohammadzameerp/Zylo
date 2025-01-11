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

//-------let allows the data push & delete   but in const only we cannot push
let posts = [
  {
    id: uuidv4(),
    username: "Aisha",
    content: "👻 The Whispering Mirror\n\nOne night, I cleaned my mirror and turned off the lights. A faint glow appeared, and whispers filled the room. The mirror wasn’t just a reflection—it was a doorway.",
    password: "zaMeer",
    timestamp: new Date().toLocaleString(),
    location: "Location not provided",
    likes: 0,
  },
  {
    id: uuidv4(),
    username: "Ravi",
    content: "😂 Pizza Panic\n\nOrdered a pizza online, checked 'no pineapple,' and waited. When it arrived, I opened the box to find... a whole pineapple as the topping. Even the delivery guy laughed!",
    password: "zaMeer",
    timestamp: new Date().toLocaleString(),
    location: "Location not provided",
    likes: 0,
  },
  {
    id: uuidv4(),
    username: "Sophia",
    content: "🕯️ Midnight Glimpse\n\nWhile reading late at night, my candle flickered, and I saw a shadow dart across the room. I was too scared to look back. The door was locked... or so I thought.",
    password: "zaMeer",
    timestamp: new Date().toLocaleString(),
    location: "Location not provided",
    likes: 0,
  },
  {
    id: uuidv4(),
    username: "Ali",
    content: "😱 The Silent Knock\n\nIt was past midnight, and a knock echoed through the house. I opened the door—no one. I closed it, and then the knock came from inside.",
    password: "zaMeer",
    timestamp: new Date().toLocaleString(),
    location: "Location not provided",
    likes: 0,
  },
  {
    id: uuidv4(),
    username: "Tina",
    content: "🤣 Yoga Disaster\n\nTried yoga to de-stress. Got into a complicated pose and sneezed. Let’s just say I spent the next hour untangling myself from the mat.",
    password: "zaMeer",
    timestamp: new Date().toLocaleString(),
    location: "Location not provided",
    likes: 0,
  },
  {
    id: uuidv4(),
    username: "Rahul",
    content: "🌒 The Strange Light\n\nCamping in the woods, I saw a light hovering in the distance. It moved closer, then disappeared. The next morning, there was no trace, just a burnt patch of grass.",
    password: "zaMeer",
    timestamp: new Date().toLocaleString(),
    location: "Location not provided",
    likes: 0,
  },
  {
    id: uuidv4(),
    username: "Emma",
    content: "😂 The Donut Lift\n\nAt the gym, I confidently lifted a weight. Turns out, it was just a box of donuts someone left on the bench. My coach never let me live it down.",
    password: "zaMeer",
    timestamp: new Date().toLocaleString(),
    location: "Location not provided",
    likes: 0,
  },
  {
    id: uuidv4(),
    username: "Omar",
    content: "💀 Closet Breather\n\nI heard breathing from my closet. I froze. Slowly opened it, and there it was—my cat, snuggled in my winter jacket, having the time of her life.",
    password: "zaMeer",
    timestamp: new Date().toLocaleString(),
    location: "Location not provided",
    likes: 0,
  },
  {
    id: uuidv4(),
    username: "Nina",
    content: "😂 The Laptop Cat\n\nEvery time I work, my cat thinks the keyboard is her bed. Yesterday, she sent an unfinished email to my boss. At least it wasn’t gibberish... this time.",
    password: "zaMeer",
    timestamp: new Date().toLocaleString(),
    location: "Location not provided",
    likes: 0,
  },
  {
    id: uuidv4(),
    username: "Zara",
    content: "🕷️ The Vanished Spider\n\nSaw a huge spider on my wall. Grabbed a shoe, looked back, and it was gone. Now I sleep with one eye open and a shoe in hand.",
    password: "zaMeer",
    timestamp: new Date().toLocaleString(),
    location: "Location not provided",
    likes: 0,
  },
  {
    id: uuidv4(),
    username: "Irfan",
    content: "🤣 Pole Encounter\n\nTexting while walking is dangerous. Found out the hard way when I walked straight into a pole. The onlookers? They had a good laugh.",
    password: "zaMeer",
    timestamp: new Date().toLocaleString(),
    location: "Location not provided",
    likes: 0,
  },
  {
    id: uuidv4(),
    username: "Leila",
    content: "🧟 Zombie Dream\n\nDreamt of zombies chasing me. Woke up sweaty, only to realize I fell asleep watching a horror movie marathon. No more late-night scares for me!",
    password: "zaMeer",
    timestamp: new Date().toLocaleString(),
    location: "Location not provided",
    likes: 0,
  },
  {
    id: uuidv4(),
    username: "Ayaan",
    content: "😂 Cooking Gone Wrong\n\nDecided to cook for the family. Instead, I set off the fire alarm. We ended up ordering pizza. Cooking isn’t for everyone!",
    password: "zaMeer",
    timestamp: new Date().toLocaleString(),
    location: "Location not provided",
    likes: 0,
  },
  {
    id: uuidv4(),
    username: "Hassan",
    content: "📞 The Whispering Caller\n\nAn unknown caller whispered my name. I hung up, only to hear the same voice from the other side of the room. My phone was in my pocket.",
    password: "zaMeer",
    timestamp: new Date().toLocaleString(),
    location: "Location not provided",
    likes: 0,
  },
  {
    id: uuidv4(),
    username: "Maya",
    content: "🤣 Oops Text\n\nAccidentally texted 'Love you' to my boss instead of my partner. Now I have an interesting Monday morning meeting to attend.",
    password: "zaMeer",
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
