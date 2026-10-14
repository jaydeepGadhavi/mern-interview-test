export interface User {
  id: number;
  username: string;
}

export interface AuthData {
  user: User;
  token: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}
