import { UserRole } from "../enums/user-role.enum";


export interface GroupMember {
  id: string;
  ownerName: string;
  role: UserRole;
  pets: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}