type organization = 'ALL' | 'KA' | 'MC' | 'DIRECT' | 'CHANNEL'
export interface RoleData {
  deptId: string
  userId?: string
  nickName?: string
  deptName?: string
  organization?: organization
  hasChildren? : boolean
}

export interface CacheData {
  deptId?: string
  userId?: string
  asDeptId?: string
  asUserId?: string
  organization?: organization | string
}

export interface DepartmentProp {
  params?: {
    organization?: string
    deptId?: string
    userId?: string
  }
  deptData?: RoleData
  selectedDept?: RoleData
  onDrill?: (role: RoleData) => void
  onSelect?: (role: RoleData) => void
}

type RenderChildren = () => React.ReactDOM
type HandleChange = (role: RoleData) => void
type HandleRoleChange = (role: RoleData) => void

export interface TopHeaderProp {
  className?: string
  organization: organization
  renderChildren?: RenderChildren
  onInit?: HandleChange
}

export interface CacheOrgProp {
  className?: string
  disabled?: boolean
  value?: { deptId: string, userId?: string }
  renderChildren?: RenderChildren
  onInit?: HandleChange
  onChange?: HandleChange
  onRoleChange?: HandleRoleChange
}

type Theme = 'GREED'
export interface FilterOrgProp {
  theme?: Theme,
  className?: string
  disabled?: boolean
  value?: { deptId: string, userId?: string }
  renderChildren?: RenderChildren
  onChange?: HandleChange
  onInit?: HandleChange
}

export interface HistoryPathProp {
  asDeptId?: string
  deptId?: string
  userId?: string
  onChange: (role: RoleData) => void
}

export interface FilterChildrenProp {
  theme?: Theme
  className?: string
  disabled?: boolean
  deptData?: RoleData
  roleList?: RoleData[]
  lastRole?: RoleData
  renderChildren?: (child: React.ReactNode, options, arg) => React.ReactDOM
  onClick?: () => void
}
