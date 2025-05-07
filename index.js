import express from "express";
import db from "./database.js";

const app = express(); // is the express module written express team
const port = 3000;

app.use(express.json());

app.use(express.static("public"));

// app.use is used to apply express middlewares
// we use express.json middlewares
app.get("/getdata", (req, res) => {
  const user = db.getAll("users");
  res.status(200).json({ user });
});
app.post("/register", (req, res) => {
  const user = db.findOne("users", { username: req.body.username });
  if (user) {
    return res.status(403).json({ message: "username already exists" });
  }
  db.add("users", req.body);
  res.status(201).json({ message: "user created" });
});

app.post("/login", (req, res) => {
  // req - sent by postman // res - send back by us
  console.log(req.body);
  const user = db.findOne("users", { username: req.body.username });
  if (user === null) {
    return res.status(401).json({ message: "user doesn't exist" });
  }

  if (user.password !== req.body.password) {
    return res.status(401).json({ message: "wrong password or username" });
  }

  res.status(200).json({ user });
});
//update profile
app.put("/update", (req, res) => {
  let user = db.getById("users", req.body.id);
  if (user === undefined) {
    return res.status(401).json({ message: "you cannot update non user" });
  }
  user = db.update("users", req.body.id, req.body);
  res.status(200).json(user);
});

//listen port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
