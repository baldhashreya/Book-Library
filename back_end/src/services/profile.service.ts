import { LogLevel } from "../../common/enum";
import { addLog } from "../../common/logger";
import { CommonRepository } from "../repositories/common.repository";

export class ProfileService {
  constructor(private readonly commonRepository: CommonRepository) {
    this.commonRepository = commonRepository;
  }

  public async getUser(id: string) {
    addLog(LogLevel.info,"getUser Service", id);
    return this.commonRepository.getUserById(id);
  }
}
