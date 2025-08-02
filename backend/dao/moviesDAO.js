
import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

// Trong dao/moviesDAO.js
let movies; // Dòng này phải ở đầu file

export default class MoviesDAO {
    static async injectDB(conn) {
        if (movies) {
            return; // Nếu đã có movies rồi thì không làm gì nữa
        }
        try {

            console.log(`Đang cố gắng kết nối DB: ${process.env.MOVIEREVIEWS_NB}`);

            movies = await conn.db(process.env.MOVIEREVIEWS_NB).collection("movies");
            if (movies) {
                console.log(`Đã kết nối thành công đến collection 'movies'`);
            } else {

                console.error("Lỗi: Collection 'movies' được trả về là null/undefined.");
                throw new Error("Collection 'movies' không hợp lệ sau khi kết nối.");
            }

        } catch (e) {
            console.error(`ERROR in injectDB: Không thể kết nối hoặc lấy collection 'movies'. Lỗi chi tiết: ${e.message}`);
            throw e;
        }
    }

    static async getMovies({
        filters = null,
        page = 0,
        moviesPerPage = 20,
    } = {}) {
        let query;
        if (filters) {
            if (`title` in filters) {
                query = { $text: { $search: filters['title'] } }
            } else if ("rated" in filters) { // Đảm bảo là "rated" chứ không phải "rate"
                query = { "rated": { $eq: filters['rated'] } } // Đảm bảo là "rated"
            }
        }

        let cursor;
        try {
            // Lỗi "undefined (reading 'find')" xảy ra ở đây
            cursor = await movies.find(query).limit(moviesPerPage).skip(moviesPerPage * page);
            const moviesList = await cursor.toArray();
            const totalNumMovies = await movies.countDocuments(query);
            return { moviesList, totalNumMovies };
        } catch (e) {
            console.error(`ERROR in getMovies: Không thể thực hiện lệnh find: ${e.message}`);
            if (movies === undefined) {
                console.error("Biến 'movies' (collection) vẫn là undefined khi getMovies được gọi.");
            }
            return { moviesList: [], totalNumMovies: 0 };
        }
    }
    static async getRatings() {
        let ratings = []
        try {
            ratings = await movies.distinct("rated");
            return ratings;
        } catch (e) {
            console.error(`unable to get ratings, ${e}`);
            return ratings;
        }
    }

    static async getMovieById(id) {

        //          try {
        //             // Thêm console.log để kiểm tra đối tượng 'movies'
        //             console.log("MoviesDAO: Trong getMovieById - Kiểm tra đối tượng 'movies':");
        //             console.log("MoviesDAO: movies (là object?):", typeof movies === 'object' && movies !== null);
        //             console.log("MoviesDAO: movies.collectionName (nếu tồn tại):", movies ? movies.collectionName : 'Không xác định');

        //             // Thêm console.log để kiểm tra giá trị của new ObjectId(id)
        //             let objectId;
        //             try {
        //                 objectId = new ObjectId(id);
        //                 console.log("MoviesDAO: ID nhận được:", id);
        //                 console.log("MoviesDAO: ID sau khi chuyển đổi sang ObjectId:", objectId);
        //             } catch (oidError) {
        //                 console.error(`MoviesDAO: Lỗi khi chuyển đổi ID '${id}' sang ObjectId: ${oidError.message}`);
        //                 // Nếu ID không hợp lệ, không thể tìm thấy phim
        //                 return null; 
        //             }

        //             return await movies.aggregate([
        //                 {
        //                     $match: {
        //                         _id: objectId, // Sử dụng objectId đã được kiểm tra
        //                     }
        //                 },
        //                 {
        //                     $lookup: {
        //                         from: "reviews",
        //                         localField: "_id",
        //                         foreignField: "movie_id",
        //                         as: "reviews",
        //                     }
        //                 }
        //             ]).next();
        //         } catch (e) {
        //             console.error(`MoviesDAO: Lỗi trong getMovieById: ${e.message}`);
        //             // Kiểm tra thêm nếu lỗi xảy ra vì 'movies' không được khởi tạo
        //             if (movies === undefined || movies === null) {
        //                 console.error("MoviesDAO: Biến 'movies' (collection) không được khởi tạo hoặc là null khi getMovieById được gọi.");
        //             }
        //             throw e; // Ném lại lỗi để controller có thể bắt và trả về 500
        //         }
        //     }
        // }









        ///////////////////////////////////////
        try {


            return await movies.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                    }
                },
                {
                    $lookup: {
                        from: "reviews",
                        localField: "_id",
                        foreignField: "movie_id",
                        as: "reviews",
                    }
                }
            ]).next();
        } catch (e) {
            console.error(`something went wrong in getMovieById: ${e}`);
            throw e;
        }
    }
}




