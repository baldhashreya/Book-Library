import { UsersModel, Users } from "common";

export class AuthorizationRepository {
  public async getUserByEmail(email: string): Promise<UsersModel | null> {
    return Users.findOne({ email });
  }
}
