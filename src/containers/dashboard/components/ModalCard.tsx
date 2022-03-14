import { Modal, Steps, Card, Checkbox, Form, Radio, InputNumber, message } from 'antd'
import { useState, useMemo, useEffect } from 'react'
import {
  createStrategyChild,
  updateStrategyChild,
} from '@/services/strategy'
import ExcludeCard from './ExcludeCard'
import './ModalCard.less'

interface ArrAction {
  label:string,
  id: number,
  value: string,
  params: [],
  periodStrategy: number | string,
  detail: [{shopcount: string, paidsuccorderavg: number, chrgdurnavg: number}]
}

interface requestParamsAction {
  periodStrategy?: number,
  targetPeriodPrice?: string | number,
  targetPeriod?: string | number,
}

const { Step } = Steps
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
}

const valueOptions = [
  { label: '半小时', value: 2 },
  { label: '一小时', value: 3 },
]
const requestParams: requestParamsAction[] = [
  { periodStrategy: 1, targetPeriodPrice: 0, targetPeriod: 2 },
  { periodStrategy: 2, targetPeriodPrice: 0, targetPeriod: 2 },
  { periodStrategy: 3, targetPeriodPrice: 0, targetPeriod: 2 },
  { periodStrategy: 4, targetPeriodPrice: 0, targetPeriod: 2 },
]

const arrList: ArrAction[] = [
  { label: '1.5元/小时', id: 1, value: 'oneHalf', periodStrategy: 0, params: [], detail: [{ shopcount: '', paidsuccorderavg: 0, chrgdurnavg: 0 }] },
  { label: '不足2元/小时', id: 2, value: 'lessTwo', periodStrategy: 0, params: [], detail: [{ shopcount: '', paidsuccorderavg: 0, chrgdurnavg: 0 }] },
  { label: '3元/小时', id: 3, value: 'threeHour', periodStrategy: 0, params: [], detail: [{ shopcount: '', paidsuccorderavg: 0, chrgdurnavg: 0 }] },
  { label: '大于3元/小时', id: 4, value: 'aboveThree', periodStrategy: 0, params: [], detail: [{ shopcount: '', paidsuccorderavg: 0, chrgdurnavg: 0 }] },
]

const preHour = 2

const ModalCard = (
  props: {strategy?: any,
  cancel?: () => void,
  searchStrategy?: () => any,
  onOk: () => void, cardList: any,
  strategyOptions: any},
) => {
  const { strategy, cancel, onOk, strategyOptions, cardList, searchStrategy } = props
  const [formInstance] = Form.useForm()
  const [checkedArray, setCheckedArray] = useState([] as any)
  const [labelValue, setLabelValue] = useState(arrList)
  const [dateTime, setDateTime] = useState(0)
  // 编辑初始化
  useEffect(() => {
    if (strategy?.isCreate) {
      setDateTime(new Date().getTime())
      if (strategy?.requestParams?.length) {
        labelValue?.forEach((i, index) => {
          labelValue[index] = { ...i, ...strategy?.requestParams.filter((item:any) => item.periodStrategy === i.id)[0] }
        })
        requestParams?.forEach((i, index) => {
          requestParams[index] = {
            ...i,
            ...strategy?.requestParams.filter((item:any) => item.periodStrategy === i.periodStrategy)[0],
          }
        })
        setLabelValue([...labelValue])
        setCheckedArray(labelValue.filter(item => item.periodStrategy))
      }
    } else {
      setCheckedArray([])
    }
  }, [cardList, strategy])

  useMemo(() => {
    setLabelValue([...cardList])
  }, [cardList])

  // 策略加载
  const strategyChange = (item: any, val: any) => {
    setCheckedArray([...checkedArray, item])
    checkedArray.forEach((i: any) => {
      if (i.id === item.id) {
        if (val.target.checked) {
          setCheckedArray(checkedArray.filter((index: any) => { return item.id === index.id }))
        } else {
          setCheckedArray(checkedArray.filter((index: any) => { return item.id !== index.id }))
        }
      }
    })
  }

  const saveStrategy = async () => {
    const paramsList: any = []
    for (let i = 0; i < checkedArray.length; i++) {
      for (let j = 0; j < requestParams.length; j++) {
        if (requestParams[j].periodStrategy === checkedArray[i]?.id) {
          paramsList.push(requestParams[j])
        }
      }
    }
    const params = {
      id: strategy.id,
      strategyMainId: strategy.strategyMainId || strategy.id,
      strategyCategaryId: strategyOptions.length ? strategyOptions[0]?.value : strategy.id,
      name: strategyOptions.length ? strategyOptions[0]?.label : strategy.name,
      requestParams: {},
    }
    console.log(strategy)
    params.requestParams = paramsList
    if (!strategy.isEdit) {
      await createStrategyChild(params)
      message.success('保存成功')
    } else {
      await updateStrategyChild(params)
    }
    searchStrategy()
    onOk()
  }

  const setParamsMap = (changeValue: {id?: number,
    targetPeriodPrice?: number,
    targetPeriod?: number,
    periodStrategy?: any }) => {
    requestParams.forEach((item: requestParamsAction) => {
      if (item.periodStrategy === changeValue.periodStrategy) {
        if (changeValue?.targetPeriodPrice) {
          item.targetPeriodPrice = changeValue?.targetPeriodPrice
        } else {
          item.targetPeriod = changeValue?.targetPeriod
        }
      }
    })
  }

  const formItem = useMemo(() => {
    const currentChange = (item: any, e: any) => {
      setParamsMap({ periodStrategy: item.id, targetPeriodPrice: e })
    }
    const preHourChange = (item: any, e: any) => {
      setParamsMap({ periodStrategy: item.id, targetPeriod: e.target.value })
    }
    return (
      <Form
        {...formLayout}
        form={formInstance}
        style={{ height: '120px', overflowY: 'scroll' }}
      >
        <div className="strategy-card-title">
          <span style={{ marginLeft: '60px' }}>当前水平</span>
          <span style={{ margin: '0 40% 0 12%' }}>水平</span>
          <span>影响门店数</span>
        </div>
        {checkedArray.map((item :any) => {
          return (
            <Form.Item
              key={item.id}
              label={item.label}
              name={item.value}
              style={{ marginLeft: '20px' }}
            >
              <span style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <div>
                  <InputNumber<string>
                    type="number"
                    defaultValue={item?.targetPeriodPrice || 0}
                    onChange={val => currentChange(item, val)}
                    style={{ width: 100 }}
                    step={0.5}
                  />
                  <Radio.Group
                    options={valueOptions}
                    style={{ marginLeft: '12px' }}
                    defaultValue={item?.targetPeriod || preHour}
                    onChange={val => preHourChange(item, val)}
                  />
                </div>
                <span>{item?.detail[0]?.shopcount}个</span>
              </span>
            </Form.Item>
          )
        })}
      </Form>
    )
  }, [formInstance, checkedArray])

  return (
    <>
      <Modal
        onCancel={cancel}
        visible={strategy.isCreate}
        onOk={saveStrategy}
        okButtonProps={{
          disabled: !checkedArray.length,
        }}
        okText="确认保存"
        cancelText="取消"
        width={850}
      >
        <Steps current={0} progressDot>
          <Step title="溢价" />
          <Step title="排独" />
          <Step title="付费订单率" />
        </Steps>
        <div className="strategy-card">
          {labelValue.map((item) => {
            return (
              <Card
                title={item.label}
                key={item.label + dateTime}
                extra={<Checkbox
                  defaultChecked={item.periodStrategy > 0}
                  onChange={val => strategyChange(item, val)}
                />}
                className="strategy-card-tag"
              >
                <p>门店数：{item?.detail[0]?.shopcount || 0}个</p>
                <p>平均比单价：{item.detail[0]?.paidsuccorderavg?.toFixed(2) || 0}元</p>
                <p>平均时长：{item.detail[0]?.chrgdurnavg?.toFixed(2) || 0}时</p>
                <p>不同品类平均时长：</p>
                <ExcludeCard id={item.id} params={item?.params || []} />
              </Card>
            )
          })}
        </div>
        {formItem}
      </Modal>
    </>
  )
}

export default ModalCard
