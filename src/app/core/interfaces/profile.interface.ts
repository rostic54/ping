import { PetInfo } from './pet-info.interface';

export interface Profile {
  id: string;
  email: string;
  ownerName: string;
  pets?: PetInfo[];
}

