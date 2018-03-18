import { BaseCustomClass } from './baseCustomClass';

export class User extends BaseCustomClass {
  public cif: number;
  public displayName: string;
  public email: string;
  public password: string;
  public usertype: number;

  constructor(cif: number,displayName:string, email: string, password: string, usertype: number) {
    super();
    this.cif = cif;
    this.displayName = displayName;
    this.email = email;
    this.password = password;
    this.usertype = usertype;
  }
}
