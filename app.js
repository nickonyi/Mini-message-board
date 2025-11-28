import express from "express";
import dotenv from "dotenv";
import indexRouter from "./routes/indexRouter.js";
import { fileURLToPath } from "url";
import path from "path";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.js
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", indexRouter);

app.listen(PORT, () => {
  console.log(`listening at port:${PORT}`);
});
