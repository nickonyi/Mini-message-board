import express from "express";
import dotenv from "dotenv";
import { pathToFileURL } from "url";
import path from "path";

const app = express();

dotenv.config();

const __fileName = pathToFileURL(import.meta.url);
const __dirName = path.dirname(__fileName);
console.log(__fileName);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
