import { generateUUID } from "../utils/generateUUID";

export interface User {
  id: string;
  name: string;
  password: string;
  isUserLoggedIn: boolean;
}

export class UserDataBase {
  users: { [key: string]: User } = {};

  getUser(name: string): User | undefined {
    return this.users[name];
  }

  createUser(user: Omit<User, "id" | "isUserLoggedIn">): User {
    const id = generateUUID();
    const newUser = { ...user, id, isUserLoggedIn: true };
    this.users[user.name] = newUser;
    return newUser;
  }
}
