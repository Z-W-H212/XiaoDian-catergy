import { useMemo } from 'react'
import { RightOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useDeptList } from './org-service'
import { DepartmentProp } from './types'

import './new-style.less'

export default function Department (props: DepartmentProp) {
  const { params, selectedDept } = props
  const { data } = useDeptList(params)

  const onSelect = (deptRole) => {
    props.onSelect && props.onSelect(deptRole)
  }

  const onDrill = (deptRole) => {
    onSelect(deptRole)
    props.onDrill && props.onDrill(deptRole)
  }

  const children = useMemo(() => {
    if (!(data instanceof Array)) {
      return null
    }
    return data.map((item) => {
      const { deptName, nickName, deptId, userId, hasChildren } = item
      const key = `${deptId}-${userId}`
      const active = String(selectedDept?.deptId) === deptId && String(selectedDept?.userId) === userId
      const handleSelect = !active ? () => onSelect(item) : undefined
      const handleDrill = hasChildren ? () => onDrill(item) : handleSelect

      return (
        <div key={key} className="dept-item">
          <div className="dept-item-label" onClick={handleDrill}>
            {`${deptName}-${nickName}`}
            {hasChildren ? <RightOutlined className="dm-org-path" /> : <div />}
          </div>
          <div className="dept-item-icon" onClick={handleSelect}>
            {active ? <CheckCircleOutlined className="dm-org-radio-active" /> : <div className="dm-org-radio" />}
          </div>
        </div>
      )
    })
  }, [data, selectedDept])

  return (
    <div className="dm-org-dept">
      {children}
    </div>
  )
}
