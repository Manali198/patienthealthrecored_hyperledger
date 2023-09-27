import express from "express";
import dotenv from 'dotenv'
import cors from "cors"
const app = express();
import ("./db/db.js");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import * as organizationRouter from "./router/organizationRouter.js";
import * as patientRouter from "./router/patientRouter.js";
dotenv.config()
app.use(cors())

app.use("/api/organization",organizationRouter.route)
app.use("/api/patient",patientRouter.route)
const port = process.env.PORT || 3080
app.listen(port,()=>{
    console.log(`app is running on ${port}`)
})