import { WhereOptions } from "sequelize";
import User, { UserCreationAttributes, UserUpdateAttributes } from "./user.model";
import { UserDTO } from "./user.types";

export class UsersQuery {
  async findOneUser(where: WhereOptions<any>, attributes?: string[]) {
    const user = await User.findOne({
      where,
      attributes,
    });

    return user;
  }

  async createUser(userDetails: UserCreationAttributes): Promise<Partial<UserDTO>> {
    const user = await User.create(userDetails);

    return user;
  }

  async findAllUsers(where: WhereOptions<any>, attributes?: string[]) {
    const user = await User.findAll({
      where,
      attributes,
    });

    return user;
  }

  async upsertUserDetails(
    userDetails: UserUpdateAttributes
  ): Promise<[UserDTO, boolean | null]> {
    const user = await User.upsert(userDetails);
    return user;
  }
}
