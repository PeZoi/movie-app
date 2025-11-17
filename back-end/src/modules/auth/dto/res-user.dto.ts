export class UserResponseDto {
  _id: string;
  name: string;
  email: string;
  gender?: string;
  avatar?: string;

  constructor(user: any) {
    this._id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.gender = user.gender;
    this.avatar = user.avatar;
  }
}
