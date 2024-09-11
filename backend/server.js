import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router as aiGenRouter } from "./routes/aiGen.route.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    res.send("Hello World!");
});

app.use("/api", aiGenRouter);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
