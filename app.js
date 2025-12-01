import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import router from "./routes/router.js";

const app = express();

dotenv.config();

const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);

app.set("views", path.join(__dirName, "views"));
app.set("view engine", "ejs");
app.use("/", router);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
