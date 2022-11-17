import express from "express"
import createRouter, { router } from "express-file-routing"
import { connect } from "mongoose"
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();


const app = express();

app.all("/*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    return next();
  });

app.use(cookieParser());
app.use(express.json())
app.use("/", router()) // as router middleware or

createRouter(app) // as wrapper function
connect(process.env.MONGO_URI!).then(() => {
    app.listen(2000, () => {
        console.log("Server started at http://localhost:2000")
    })
}).catch(err => {
    console.log(err);
});