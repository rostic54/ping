import { UserRole } from "../enums/user-role.enum";
import { GroupMember } from "./group-member.interface";


export interface GroupFullInfo {
  id: string;
  name: string;
  description?: string;
  maxMembers: number;
  memberCount: number;
  members: GroupMember[];
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