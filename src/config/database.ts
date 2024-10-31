import { Sequelize } from "sequelize";

const sequelize = new Sequelize("storeeingdevdb", "root", "123456789", {
  host: "localhost",
  dialect: "mysql",
  logging: false
});

export { sequelize };
