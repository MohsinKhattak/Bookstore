import User from '../models/user.model';
import { generateToken } from '../utility/jwt.util';

export async function userExistsByEmail(email: string) {
  return User.findOne({ email });
}

export async function createUser(params: {
  name: string;
  email: string;
  password: string;
}) {
  const user = new User(params);
  await user.save();
  return user;
}

export async function findUserByEmail(email: string) {
  return User.findOne({ email });
}

export async function comparePassword(user: any, password: string) {
  return user.comparePassword(password);
}

export function makeJwt(userId: string) {
  return generateToken(userId);
}

export async function findUserById(id: string) {
  return User.findById(id);
}
