import app from "./server.js"; // Đảm bảo dòng này đã được khôi phục
import mongodb from "mongodb";
import dotenv from "dotenv";
import MoviesDAO from "./dao/moviesDAO.js";
import ReviewsDAO from "./dao/reviewsDAO.js";




async function main() {
  dotenv.config();
  const client = new mongodb.MongoClient(process.env.MOVIEREVIEWS_DB_URI);
  const port = process.env.PORT || 8000; // Hoặc 3000 nếu bạn muốn
  try {
    await client.connect(); // kết nối tới mongoDB Cluster
    await MoviesDAO.injectDB(client);
    await ReviewsDAO.injectDB(client);
    app.listen(port, () => {
      console.log("Server is running on port: " + port);
    });
  } catch (e) {
    console.error(`Lỗi kết nối MongoDB: ${e}`); // Log lỗi nếu kết nối thất bại
    process.exit(1);
  }
}
main().catch(console.error); // in lỗi trên consolenpm
