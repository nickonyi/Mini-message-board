import { Router } from "express";

const router = Router();

const messages = [
  {
    text: "Hi there!",
    user: "Amando",
    added: new Date(),
  },
  {
    text: "Hello World!",
    user: "Charles",
    added: new Date(),
  },
  {
    text: "Hello World!",
    user: "John",
    added: new Date(),
  },
];

router.get("/", (req, res) => {
  res.render("index", { title: "Mini message board", messages: messages });
});

router.get("/new", (req, res) => {
  res.render("form");
});

router.get("/message/:id", (req, res) => {
  const id = req.params.id;
  const message = messages[id];

  res.render("messageDetails", { message });
});

router.post("/new", (req, res) => {
  const { author, text } = req.body;
  messages.push({ text, user: author, added: new Date() });

  res.redirect("/");
});

export default router;
