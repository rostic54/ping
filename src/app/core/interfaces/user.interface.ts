import { PetInfo } from './pet-info.interface';

export interface User {
  id: string;
  email: string;
  ownerName?: string;
  pets?: PetInfo[];
}

