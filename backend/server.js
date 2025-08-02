// server.js
import express from "express";
import cors from "cors";
import movies from "./api/movies.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[Request Log] Method: ${req.method}, URL: ${req.url}`);
  next(); // QUAN TRỌNG: Gọi next() để chuyển đến middleware/route tiếp theo
});


app.use("/api/v1/movies", movies);

app.use("*", (req, res) => {
  console.log(`[404 Handler] Not Found for URL: ${req.url}`); // Log khi không tìm thấy route
  res.status(404).json({ error: "not found" });
});

export default app;
