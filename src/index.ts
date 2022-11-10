import express from "express"
import createRouter, { router } from "express-file-routing"
import { connect } from "mongoose"

const app = express()

app.use(express.json())
app.use("/", router()) // as router middleware or

createRouter(app) // as wrapper function
connect("mongodb://localhost:27017/test-api").then(() => {
    app.listen(2000, () => {
        console.log("Server started at http://localhost:2000")
    })
}).catch(err => {
    console.log(err);
});