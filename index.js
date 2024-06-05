import connectDB from "./db/index.js"
import { app } from "./app.js";




connectDB()
.then(() => {
    app.listen( 3000, () => {
        console.log("⚙️ Server is running at port " ,3000 , "⚙️");
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
