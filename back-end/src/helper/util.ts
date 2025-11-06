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

export const generateSlug = (name: string): string => {
  if (!name?.trim()) return '';

  return name
    .toLowerCase()
    .normalize('NFD') // tách ký tự có dấu
    .replace(/[\u0300-\u036f]/g, '') // xóa dấu
    .replace(/[đĐ]/g, 'd') // chuyển đ -> d
    .replace(/[^a-z0-9\s-]/g, '') // loại ký tự đặc biệt
    .trim() // bỏ khoảng trắng đầu/cuối
    .replace(/\s+/g, '-') // đổi khoảng trắng thành -
    .replace(/-+/g, '-') // gộp nhiều dấu - liền nhau
    .replace(/^-+|-+$/g, ''); // xóa dấu - ở đầu/cuối
};
