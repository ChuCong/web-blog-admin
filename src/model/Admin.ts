import type { Pivot, Role , Teacher} from "@/model"
export interface Admin {
  id: number,
  name: string,
  user_name: string | null,
  email: string,
  is_main: number | null,
  is_super_admin: number | null,
  listPermission?: [],
  permissions?: [],
  teacher?: Teacher | null,
  roles?: [
    {
      id: number,
      name: string,
      guard_name: string,
      pivot: Pivot,
      permissions?: Role[];
    }
  ]

}