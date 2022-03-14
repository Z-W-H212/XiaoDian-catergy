import { useState, useEffect } from 'react'

import Dialog from './dialog'
import FilterRole from './filter-role'
import HistoryPath from './history-path'
import Department from './department'
import FilterChildren from './filter-children'

import { useUserRoles, useLastRole, useDeptList, setAsRole } from './org-service'
import { setDeptCache, setRoleCache, getCache, findRole } from './utils'
import { RoleData, CacheData, CacheOrgProp } from './types'

import './new-style.less'

export default function CacheOrg (props: CacheOrgProp) {
  const { className, disabled, renderChildren, onInit } = props

  const { data: roleList } = useUserRoles()
  const { data: lastRole, mutate } = useLastRole(roleList)

  const cacheData = getCache()
  const [params, setParams] = useState<CacheData>()
  const [deptData, setDeptData] = useState<RoleData>()
  const [unconfirmedData, setUnconfirmedData] = useState<RoleData>()
  const [visible, setVisible] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const { data: deptList } = useDeptList(params)

  const onDeptSelect = (deptData) => {
    setUnconfirmedData(deptData)
  }

  const onDeptDrill = (deptData) => {
    setParams({ ...params, ...deptData })
    onDeptSelect(deptData)
  }

  const onRoleChange = async (roleData) => {
    const { deptId, userId, organization } = roleData
    setParams({ asDeptId: deptId, asUserId: userId, deptId, userId, organization })
    onDeptSelect(roleData)
    mutate()
  }

  const onGoback = (deptData) => {
    setParams({ ...params, ...deptData })
    onDeptSelect(deptData)
  }

  const onOk = () => {
    if (unconfirmedData) {
      const { deptId, userId, organization } = unconfirmedData
      // 更新缓存，包括前端缓存
      setAsRole(params?.asDeptId, params?.asUserId).then(() => {
        setRoleCache(params?.asDeptId, params?.asUserId, params?.organization)
        setDeptCache(deptId, userId, organization)
        setDeptData(unconfirmedData)
        mutate()
        props.onChange && props.onChange(unconfirmedData)
      })
    }
    setVisible(false)
  }
  const onCancel = () => {
    setVisible(false)
  }

  useEffect(() => {
    // 初始化的时候，本地cache和服务端缓存可能都没有值
    if (roleList.length > 0) {
      let role
      if (lastRole) {
        const item = findRole(lastRole, roleList)
        item && (role = item)
      } else if (lastRole === null) {
        role = roleList[0]
      }
      if (role) {
        const { deptId, userId, organization } = role
        if (!cacheData.deptId || cacheData.asDeptId !== deptId) {
          setAsRole(deptId, userId).then(() => {
            setRoleCache(deptId, userId, organization)
            setParams({ asDeptId: deptId, asUserId: userId, deptId, userId, organization })
          })
        } else if (!params) {
          // fix: 出现过接口和sessionStorage都有值，但是cookie没值的情况，现在每次初始化都设置一次
          setAsRole(deptId, userId).then(() => {
            setParams({
              asDeptId: deptId,
              asUserId: userId,
              deptId: cacheData.deptId,
              userId: cacheData.userId,
              organization,
            })
          })
        }
      }
    }
  }, [roleList, lastRole])

  useEffect(() => {
    if (deptList instanceof Array) {
      const item = deptList.find((item) => {
        return item.deptId === params?.deptId && item.userId === params?.userId
      })
      if (!deptData) {
        const deptData = item || deptList[0]
        setDeptData(deptData)
        onDeptSelect(deptData)
      }
    }
  }, [deptList])

  useEffect(() => {
    if (!initialized && deptData) {
      onInit && onInit(deptData)
      setInitialized(true)
    }
  }, [deptData, initialized])

  return (
    <>
      <FilterChildren
        className={className}
        disabled={disabled}
        lastRole={lastRole}
        deptData={deptData}
        roleList={roleList}
        renderChildren={renderChildren}
        onClick={() => setVisible(true)}
      />
      <Dialog visible={visible} onOk={onOk} onCancel={onCancel}>
        <div className="dm-cache-org-dialog">
          <FilterRole roleList={roleList} roleData={lastRole} onRoleChange={onRoleChange} />
          <HistoryPath
            asDeptId={params?.asDeptId}
            deptId={unconfirmedData?.deptId}
            userId={unconfirmedData?.userId}
            onChange={onGoback}
          />
          <Department
            params={params}
            selectedDept={unconfirmedData}
            onDrill={onDeptDrill}
            onSelect={onDeptSelect}
          />
        </div>
      </Dialog>
    </>
  )
}
