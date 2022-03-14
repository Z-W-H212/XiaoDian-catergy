import { useMemo, useState, useEffect } from 'react'
import useSWR from 'swr'

import { zApi } from '@dian/app-utils'
import { RoleData } from './types'

const options = { revalidateOnFocus: false, dedupingInterval: 3600000 }

export function useUserRoles (organization: any) {
  const [userList, setUserList] = useState<RoleData[]>([])

  useEffect(() => {
    const fetch = async () => {
      const data = await zApi.get('/shield/v1/manage/userRoles')

      if (data instanceof Array) {
        let list = data.map((item) => {
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
        if (organization) {
          list = list.filter((item) => {
            return item.organization === organization
          })
        }
        setUserList(list)
      }
    }
    fetch()
  }, [organization])

  return useMemo(() => {
    return { data: userList }
  }, [userList])
}

export function useLastRole (roleList) {
  const url = roleList?.length > 0 ? '/shield/v1/permission/getAsRole' : null
  const { data, error, mutate } = useSWR(url, async url => zApi.post(url), options)

  if (roleList?.length > 0 && data === null) {
    return { data: roleList[0], mutate }
  }
  return { data, error, mutate }
}

type DeptListParams = {
  asDeptId?: string | null
  asUserId?: string | null
  deptId?: string | null
  userId?: string | null
  organization?: string | null
}

export function useDeptList (params: DeptListParams = {}) {
  const { asDeptId, asUserId, deptId, userId, organization } = params
  const [deptList, setDeptList] = useState<RoleData[]>([])

  useEffect(() => {
    const fetch = async () => {
      const data = await zApi.post(
        '/deus-ex-machina/organization/v1/getByDep',
        { asDeptId, asUserId, deptId, userId, organization },
      )
      if (data instanceof Array) {
        const list = data.map((item) => {
          const {
            departmentId: deptId,
            departmentName: deptName,
            userId,
            nickName,
            hasChildren,
            organization,
            role,
          } = item
          return {
            deptId,
            deptName,
            userId,
            nickName,
            deptLevel: role,
            organization: organization || 'All',
            hasChildren,
          }
        })
        setDeptList(list)
      }
    }
    if (deptId && organization) {
      fetch()
    }
  }, [asDeptId, asUserId, deptId, userId, organization])

  return { data: deptList }
}

export function useHistoryPath (asDeptId, deptId, userId) {
  const url = deptId ? '/deus-ex-machina/organization/v1/getPathByDept' : null
  const arg = url ? [url, asDeptId, deptId, userId] : null
  return useSWR(arg, async url => zApi.post(url, { asDeptId, deptId, userId }), options)
}

export async function setAsRole (deptId, userId) {
  await zApi.post('/shield/v1/permission/setAsRole', { deptId, userId })
  return {}
}
