export const messages = [
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
];

export const getMessages = (req, res) => {
  res.render("index", { messages });
};

export const formData = (req, res) => {
  res.render("form");
};

export const createPosts = (req, res) => {
  const { author, text } = req.body;
  messages.push({ user: author, text, added: new Date() });

  res.redirect("/");
};

export const getMessageDetails = (req, res) => {
  const id = req.params;
  const message = messages[id];

  res.render("messageDetails", { message });
};
