import express from "express";
import cors from "cors";

import "./services/database.js";
import userRoute from "./routes/userRoute.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRoute);

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
