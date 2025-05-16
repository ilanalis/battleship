import { CommandTypes } from "..";
import { User, UserDataBase } from "../../db/userDB";
import { randomBytes, pbkdf2Sync } from "crypto";

interface UserCredentials {
  name: string;
  password: string;
}

interface RegistrationResponse {
  type: CommandTypes.REGISTRATION;
  data: string;
  id: 0;
}
interface Data {
  name: string;
  index: string;
  error: boolean;
  errorText: string;
}

const INVALID_PASSWORD_ERROR = "Invalid password";
const USER_IS_ALREADY_LOGGED_IN_ERROR = "User is already logged in";

export const handleUserRegistration = (
  userData: UserCredentials,
  db: UserDataBase
): { response: RegistrationResponse; index?: string; name?: string } => {
  const user = db.getUser(userData.name);
  if (!user) {
    const newUser = db.createUser(userData);

    return {
      response: createResponse(newUser),
      index: newUser.id,
      name: newUser.name,
    };
  }
  if (user.isUserLoggedIn) {
    return { response: createResponse(user, USER_IS_ALREADY_LOGGED_IN_ERROR) };
  }
  if (user.password === userData.password) {
    console.log(loggedInMessage(userData.name));

    return { response: createResponse(user), index: user.id, name: user.name };
  }

  return { response: createResponse(user, INVALID_PASSWORD_ERROR) };
};

const createResponse = (userData: User, errorText: string = "") => {
  const data: Data = {
    name: userData.name,
    index: userData.id,
    error: errorText ? true : false,
    errorText: errorText,
  };
  const response: RegistrationResponse = {
    type: CommandTypes.REGISTRATION,
    data: JSON.stringify(data),
    id: 0,
  };
  return response;
};

const loggedInMessage = (name: string) => {
  return `You have successfully logged in! { name: ${name}, password: **** }`;
};
