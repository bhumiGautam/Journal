import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import dbConnect from './config/db.js'
import router from './routes/journalRoute.js'
const app = express()


dbConnect()

app.use(cors())
app.use(express.json())

app.use("/api/journal",router)



app.listen(process.env.PORT || 5000 , () =>{
    console.log("server is running on Port : " + process.env.PORT);
})