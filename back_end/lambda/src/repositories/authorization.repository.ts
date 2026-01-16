<<<<<<< HEAD:back_end/src/repositories/authorization.repository.ts
import { UsersModel, Users } from "../../common/database/models/users";
=======
import { UsersModel, Users } from "common";
>>>>>>> 74355e3e0d8474fbefe72dfaf8d3a107a1bc230d:back_end/lambda/src/repositories/authorization.repository.ts

export class AuthorizationRepository {
  public async getUserByEmail(email: string): Promise<UsersModel | null> {
    return Users.findOne({ email });
  }
}
