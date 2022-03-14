import { useEffect, useState, useMemo } from 'react'
import { CheckCircleOutlined } from '@ant-design/icons'
import './new-style.less'

export default function FilterRole (props) {
  const { roleList, roleData } = props
  const [selectedKey, setSelectedKey] = useState<string | undefined>()

  useEffect(() => {
    if (roleData) {
      const { userId, deptId } = roleData
      setSelectedKey(`${userId}-${deptId}`)
    }
  }, [roleData])

  const onSelect = (key) => {
    const [userId, deptId] = key.split('-')
    const role = roleList.find((item) => {
      return item.userId === userId && item.deptId === deptId
    })
    setSelectedKey(`${userId}-${deptId}`)
    props.onRoleChange && props.onRoleChange(role)
  }

  const children = useMemo(() => {
    if (!roleList) {
      return null
    }
    const list = roleList.map((item) => {
      const { userId, deptId, nickName, deptName } = item
      const key = [userId, deptId].join('-')
      const name = [nickName, deptName].join('-')
      const checked = key === selectedKey

      return (
        <div key={key} className="role-item" onClick={() => onSelect(key)}>
          <div className="label">
            {name}
          </div>
          <div className="check">
            {checked
              ? <CheckCircleOutlined className="dm-org-radio-active" />
              : <div className="dm-org-radio" />}
          </div>
        </div>
      )
    })
    return <div className="role-wrap">{list}</div>
  }, [roleList, selectedKey])

  return (
    <div className="dm-filter-org-role">
      <div className="header">选择角色</div>
      <div className="body">
        {children}
      </div>
    </div>
  )
}
