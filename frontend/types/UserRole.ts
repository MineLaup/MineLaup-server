export type IUserRole = 3 | 2 | 1 | 0

export const UserRole: { [id: string]: IUserRole } = {
  superadmin: 3,
  admin: 2,
  moderator: 1,
  user: 0,
}
