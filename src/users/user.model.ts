import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";// Import your interface
import { UserDTO } from "./user.types";

// Define input type for fields that are optional on creation
// Creation attributes for new users (exclude auto-generated fields)
export interface UserCreationAttributes
  extends Optional<UserDTO, "id" | "createdAt" | "updatedAt" | "deletedAt" | "refreshToken"> {}

// Update attributes to allow optional fields for partial updates
export type UserUpdateAttributes = Partial<UserCreationAttributes>;

// Define User class extending Sequelize Model with UserDTO and creation attributes
class User extends Model<UserDTO, UserUpdateAttributes> implements UserDTO {
  public id!: number;
  public email!: string;
  public username!: string;
  public password!: string;
  public createdAt!: Date | string;
  public updatedAt!: Date | string;
  public deletedAt!: Date | string;
  public refreshToken!: string | null;
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^.*@.*$/,
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    paranoid: true,
  }
);

export default User;
