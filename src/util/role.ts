export const rolesContainVacoAdmin = (roles: string[]) => {
  return roles.includes('vaco.admin')
}

export const rolesContainVacoCompanyAdmin = (roles: string[]) => {
  return roles.includes('vaco.company_admin')
}
