export type AuthJwtPayload = {
  sub: string;
  role: UserRole;
  sessionId?: string;
};
