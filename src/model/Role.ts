import type { Pivot } from "@/model"

export interface Role {
  id: number,
  name: string,
  guard_name: string | null,
  title:string,
  group: string,
  group_name: string | null,
  type:number,
  pivot: Pivot,
  created_at:string,
  updated_at:string
}

