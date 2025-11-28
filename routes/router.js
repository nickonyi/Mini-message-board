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
    text: "How’s everyone doing today?",
    user: "Lena",
    added: new Date(),
  },
  {
    text: "Just finished working on my project!",
    user: "Sam",
    added: new Date(),
  },
  {
    text: "Anyone up for a quick chat?",
    user: "Derrick",
    added: new Date(),
  },
  {
    text: "The weather is amazing today!",
    user: "Nora",
    added: new Date(),
  },
  {
    text: "Learning Express is fun!",
    user: "Tasha",
    added: new Date(),
  },
  {
    text: "Good morning everyone!",
    user: "Brian",
    added: new Date(),
  },
  {
    text: "Coffee break time ☕",
    user: "Elena",
    added: new Date(),
  },
  {
    text: "Just joined the chat!",
    user: "Kyle",
    added: new Date(),
  },
];

router.get("/", (req, res) => {
  res.render("index", { title: "Mini message board", messages: messages });
});

export default router;
