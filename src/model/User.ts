export interface User {
  id: number,
  email: string,
  full_name: string | null,
  phone_number: string,
  sex: number | null,
  birthday: string | null,
  type: number,
  avatar: string | null
}
