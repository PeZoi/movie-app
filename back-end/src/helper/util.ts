import * as bcrypt from 'bcrypt';
const saltRounds = 10;

export const hashPasswordHelper = async (plainPassword: string) => {
  try {
    const h = await bcrypt.hash(plainPassword, saltRounds);
    return h;
  } catch (error) {
    console.error('Error hashing password:', error);
  }
};

export const comparePasswordHelper = async (plainPassword: string, hashPassword: string) => {
  try {
    return await bcrypt.compare(plainPassword, hashPassword);
  } catch (error) {
    console.error('Error compare password:', error);
  }
};
