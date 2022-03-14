/**
 * hr、数据权限，组织架构相关接口
 */

import { zApi } from '@dian/app-utils'

function filterParams (params = {}) {
  const mKey = {}
  Object.keys(params).forEach(function (key: any): any {
    const v = params[key]
    if (v === null || v === undefined || (v.trim && v.trim() === '')) { return false }
    mKey[key] = v
  })
  return mKey
}

export async function getUserRoles () {
  const data: any = await zApi.get('/shield/v1/manage/userRoles')
  const list = data.map((item) => {
    const { channelType, depLevel, departName, deptId, nickName, userId } = item
    return {
      userId,
      deptId,
      nickName,
      deptName: departName,
      deptLevel: depLevel,
      organization: channelType,
    }
  })
  return list
}

export async function getAsRole () {
  return zApi.post('/shield/v1/permission/getAsRole')
}

export async function setAsRole (params) {
  await zApi.post('/shield/v1/permission/setAsRole', filterParams(params))
  return {}
}

export async function getOrganization (params) {
  const data: any = await zApi.post('/shield/organization/v1/getByDep', filterParams(params))
  const list = data.map((item) => {
    const {
      role,
      userId,
      nickName,
      departmentId,
      departmentName,
      organization,
      hasChildren,
    } = item

    return {
      userId,
      nickName,
      deptId: departmentId,
      deptName: departmentName,
      deptLevel: role,
      organization,
      hasChildren,
    }
  })
  return list
}
