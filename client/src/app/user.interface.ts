export interface IUser {
  user_id:number
  user_type:UserType
  first_name?:string
  last_name?:string
  cellphone_number?:string
  email:string
  authentication_id?:string
}

export interface IVendor {
  vendor_id:number
  user_id:number
  address:string
  description:string
  approved:number
  name:string
}

export interface UserDao {
  user: IUser
  vendor?: IVendor
}

export enum UserType {
  ADMIN = 0,
  CUSTOMER = 1,
  VENDOR = 2
}