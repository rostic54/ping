import { UserRole } from "../enums/user-role.enum";


export interface GroupFullInfo {
  id: string;
  name: string;
  description?: string;
  maxMembers: number;
  memberCount: number;
  members: UserRole[];
  latitude: number;
  longitude: number;
//   inviteTokens: Array<{
//     token: string;
//     expiresAt: Date;
//     createdBy: string;
//     isActive: boolean;
//   }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}