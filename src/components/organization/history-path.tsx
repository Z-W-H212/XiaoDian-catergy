import { useState, useMemo, useEffect } from 'react'
import { RightOutlined } from '@ant-design/icons'
import { useHistoryPath } from './org-service'
import { HistoryPathProp } from './types'

import './new-style.less'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function HistoryPath (props: HistoryPathProp) {
  const { asDeptId, deptId, userId, onChange } = props
  const [pathList, setPathList] = useState<any[]>()
  const { data } = useHistoryPath(asDeptId, deptId, userId)

  useEffect(() => {
    if (data instanceof Array) {
      setPathList(data)
    }
  }, [data])

  const chidlren = useMemo(() => {
    if (pathList) {
      return pathList.map((item, i) => {
        const { deptId, deptName, nickName } = item
        const icon = i < pathList.length - 1 ? <RightOutlined key={i} className="dm-org-path" /> : null
        return (
          <div key={deptId} className="history-label" onClick={() => onChange(item)}>
            <span>{`${deptName}_${nickName}`}</span>
            {icon}
          </div>
        )
      })
    }
    return null
  }, [pathList])

  return (
    <div className="dm-org-history">
      {chidlren}
    </div>
  )
}
