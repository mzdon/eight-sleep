export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  birthDate: string; // ISO-8601 start of day UTC date
}

export type UserDataResponse = User[];
