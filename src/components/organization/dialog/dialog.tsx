import { ReactNode } from 'react'
import { Modal } from 'antd'
import './style.less'

export interface dialogProps {
  title?: string
  visible: boolean
  children: ReactNode
  onCancel?: () => void
  onOk?: () => void
}

export interface headerProps {
  title?: string
  onCancel?: () => void
  onOk?: () => void
}

export default function Dialog (props: dialogProps) {
  const { title, visible, children, onCancel, onOk, ...arg } = props
  return (
    <Modal
      {...arg}
      visible={visible}
      width={800}
      closable={false}
      okText="确认"
      cancelText="取消"
      onOk={onOk}
      onCancel={onCancel}
    >
      <div className="dm-dialog">
        <div className="content">
          {/* 因为父级没有静态高度，所以加了一个wrap帮助children获取height */}
          <div className="wrap">
            {children}
          </div>
        </div>
      </div>
    </Modal>
  )
}
