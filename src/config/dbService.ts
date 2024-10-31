import { Sequelize } from "sequelize";
import User from "../users/user.model";

export class DatabaseService {
  private tables = [User];
  private sequelize = new Sequelize("storeeingdevdb", "root", "123456789", {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  });

  private async syncTables() {
    for (let table of this.tables) {
      await table?.sync();
    }
  }

  async connectToDB() {
    await this.sequelize.authenticate();
    console.log("Connected to database.");

    await this.syncTables();
    console.log("Tables Synced.");
  }

  async getSequelizeInstance() {
    return this.sequelize;
  }
}
