export class UserResponseDto {
  _id: string;
  name: string;
  email: string;
  gender?: string;
  avata?: string;

  constructor(user: any) {
    this._id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.gender = user.gender;
    this.avata = user.avata;
  }
}
