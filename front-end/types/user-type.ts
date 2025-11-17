export interface UserType {
  _id: string;
  name: string;
  email: string;
  gender: string;
  avatar: {
    group_id: string;
    path: string;
  };
}