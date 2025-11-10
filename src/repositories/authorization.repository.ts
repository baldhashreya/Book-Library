import Users, { UsersModel } from "../../common/database/models/users";

export class AuthorizationRepository {
  public async getUserByEmail(email: string): Promise<UsersModel | null> {
    return Users.findOne({ email });
  }
}
