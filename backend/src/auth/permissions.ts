export const permissions = [
  "users:manage",
  "pipelineStages:manage",
  "leads:create",
  "leads:assign",
  "leads:convert",
  "opportunities:create",
  "opportunities:edit:own",
  "opportunities:edit:any",
  "dashboard:view",
  "audit:view"
] as const;

export type Permission = (typeof permissions)[number];

export const rolePermissions: Record<string, Permission[]> = {
  SYSTEM_ADMIN: [...permissions],
  SALES_MANAGER: [
    "pipelineStages:manage",
    "leads:create",
    "leads:assign",
    "leads:convert",
    "opportunities:create",
    "opportunities:edit:any",
    "dashboard:view",
    "audit:view"
  ],
  SALES_REP: [
    "leads:create",
    "leads:convert",
    "opportunities:create",
    "opportunities:edit:own",
    "dashboard:view"
  ],
  ACCOUNT_MANAGER: [
    "leads:create",
    "leads:convert",
    "opportunities:create",
    "dashboard:view"
  ],
  EXECUTIVE_VIEWER: ["dashboard:view"],
  READ_ONLY: []
};

export function hasPermission(role: string, permission: Permission) {
  return rolePermissions[role]?.includes(permission) ?? false;
}
