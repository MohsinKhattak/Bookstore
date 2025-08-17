import dotenv from "dotenv";
import connectDB from "./startup/db";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 4000;

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
