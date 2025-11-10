import { SearchParams } from "../../common/interface";

export interface UsersSearchParams extends SearchParams {
  name?: string;
  email?: string;
  status?: string;
  role?: string;
}
