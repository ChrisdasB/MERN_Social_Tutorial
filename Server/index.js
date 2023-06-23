import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer"; // Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import path from "path";
import { fileURLToPath } from "url";
import {register} from "./controllers/auth.js";
import {createPost} from "./controllers/post.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import {users, posts } from "./data/index.js";

// Configuration (MiddleWare)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config(); // Invoke .env variable storage
const app = express(); // Invoke express
app.use(express.json()); // Invoke json from express
app.use(helmet()); // Helmet helps secure Express apps by setting HTTP response headers
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"})); // Disables CORS requirement
app.use(morgan("common")); // HTTP request logger
app.use(bodyParser.json({limit: "30mb", extended: true})) // Parsing incoming request bodys to json - Allows all data, not only strings
app.use(bodyParser.urlencoded({limit: "30mb", extended: true})); // Parsing incoming url-encoded request bodys to json - Allows all data, not only strings
app.use(cors()); // Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources on a web page to be accessed from another domain outside the domain from which the first resource was served.
app.use("/assets", express.static(path.join(__dirname, 'public/assets'))) // Set asset directory for images

// FILE STORAGE
const storage = multer.diskStorage({
    // Storage destination
    destination: function (req,file,cb) {
        cb(null, "public/assets");
    },
    // Filename for new file
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({storage});

// Route - Middleware - Controler
// upload.single('picture') ->  Looks for the given parameter in the req.params
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// MONGOOSE SETUP
const PORT = process.env.PORT || 6001; // Get the saved port vom .env file, fallback: 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log("Server Port: " + PORT));

    /* User.insertMany(users);
    Post.insertMany(posts); */
}).catch((error) => console.log("Did not connect! " + error));