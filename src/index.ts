import dotenv from "dotenv";
import bodyParser from "body-parser";
import "./config/database";
import { sequelize } from "./config/database";
import app from "./app";
import { DatabaseService } from "./config/dbService";

dotenv.config({
  path: "./.env",
});

// create a database service instance to sync all the tables
const databaseServiceInstance = new DatabaseService();

const PORT = process.env.PORT || 3000;

app.use(bodyParser?.json());

// User.sync()
async function start() {
  try {
    // check database connection
    await sequelize.authenticate();
    console.log("Connected to DB!")

    // sync all the tables
    await databaseServiceInstance?.connectToDB();

    console.log("Tables synced successfully")
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    throw error;
  }
}


start()
