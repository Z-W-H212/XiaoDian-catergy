import { Table, Tabs, Modal, Form, Select, Input, Radio, Button, Row, Col, Popover, Checkbox, DatePicker, TreeSelect, message } from 'antd'
import { useCallback, useMemo, useState, useEffect } from 'react'
import { detailCode, strategyTypeOptions, statuOptions } from '../components/codeDetail'
import { useHistory } from 'react-router-dom'
import usePareSearch from '@/hooks/usePareSearch'
import ModalCard from '../components/ModalCard'
import { DetailData } from '../components/DetailData'
import {
  getCitys,
  getDepById,
  onLoadDetal,
  mainUpdate,
  getReportView,
  getStrategyMain,
  toOtherStrategy,
  searchReportMain,
  childCategaryList,
  deleteStrategyMain,
  searchStrategyChild,
  deleteStrategyChild,
} from '@/services/strategy'
import './index.less'
import { dayjs } from '@dian/app-utils'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import moment from 'moment'

const { TabPane } = Tabs
const { RangePicker } = DatePicker
const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
interface ArrAction {
  label:string,
  id: number,
  value: string,
  params: [],
  periodStrategy: number | string,
  detail: [{shopcount: string, paidsuccorderavg: number, chrgdurnavg: number}]
}

const arrList: ArrAction[] = [
  { label: '1.5元/小时', id: 1, value: 'oneHalf', periodStrategy: 0, params: [], detail: [{ shopcount: '', paidsuccorderavg: 0, chrgdurnavg: 0 }] },
  { label: '不足2元/小时', id: 2, value: 'lessTwo', periodStrategy: 0, params: [], detail: [{ shopcount: '', paidsuccorderavg: 0, chrgdurnavg: 0 }] },
  { label: '3元/小时', id: 3, value: 'threeHour', periodStrategy: 0, params: [], detail: [{ shopcount: '', paidsuccorderavg: 0, chrgdurnavg: 0 }] },
  { label: '大于3元/小时', id: 4, value: 'aboveThree', periodStrategy: 0, params: [], detail: [{ shopcount: '', paidsuccorderavg: 0, chrgdurnavg: 0 }] },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let detailList:any = []
let deptId = ''
let deptLevel = ''
let total = 0

const Dashboard: React.FC = () => {
  const [strategy, setStrategy] = useState(false || {} as any)
  const [strategyTab, setStrategyTab] = useState('strategyMain')
  const [isApply, setIsApply] : [any, any] = useState(false)
  const [dataSource, setDataSource] = useState([])

  const [columnsMain, setColumnsMain] = useState([])
  const [cardList, setCardList] = useState(arrList)

  const history = useHistory()
  const { activeKey } = usePareSearch()

  const [createType, setCreateType] = useState(1)
  const [formInstance] = Form.useForm()
  const [searchFormRef] = Form.useForm()
  const [applyForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [paramsList, setParamsList] = useState({} as any)
  const [strategyOptions, setStrategyOptions] = useState([] as any)
  const [num, setNum] = useState(1)

  const [primaryParams, setPrimaryParams] = useState({ strategyType: 1, deptId: '', deptLevel: '', strategyOptions: [], strategyMainId: '', isCreate: false })

  const [cityOptions, setCityOptions] = useState([])
  const [level, setLevel] = useState('')
  const [isCreate, setIsCreate] = useState(true)
  const [treeMap, setTreeMap] = useState([] as any)
  const [current, setCurrent] = useState(1)

  let SearchColumns : any = []

  // 主策略查询
  const reset = () => {
    formInstance.resetFields()
    searchFormRef.resetFields()
  }

  // 策略卡片加载
  const strategyCard = async (row?: any) => {
    const res = await formInstance.validateFields()
    const params = {
      code: 'period_strategy_chart',
      paramMap: {
        deptId: res?.deptId?.split('-')[0] || '',
        deptLevel: deptLevel || '',
        periodStrategy: 0,
      },
      size: 20,
      start: 1,
      versionCode: '0',
    }
    if (!res?.deptId) {
      params.paramMap = { ...res }
    }
    if (row) {
      params.paramMap = { ...row, shopCityCode: row?.cityId }
    }

    const promises: any[] = []
    arrList.forEach(async (value) => {
      params.paramMap.periodStrategy = value.id
      promises.push(getReportView({ ...params, code: 'period_strategy' }))
      promises.push(getReportView({ ...params }))
    })
    setLoading(true)
    const result = await Promise.all(promises)
    setLoading(false)
    if (result.length) {
      let i = 0
      for (let index = 0; index < arrList.length; index++) {
        for (; i < result.length; i++) {
          if (i % 2 !== 0) {
            arrList[index].params = result[i]?.pageInfo.list
            break
          } else {
            arrList[index].detail = result[i]?.pageInfo.list
          }
        }
        i += 1
      }
    }
    setCardList([...arrList])
  }

  useEffect(() => {
    setCardList([...arrList])
  }, [])

  // 策略查询
  const searchStrategy = async (e?: string, row?: any, page?: any) => {
    const params = await searchFormRef.validateFields()
    params.createDate = params.createDate
      ? [
        moment(params?.createDate[0]?.$d.getTime() || '0').format('YYYY-MM-DD'),
        moment(params?.createDate[1]?.$d.getTime() || '0').format('YYYY-MM-DD'),
      ]
      : []
    params.pageSize = page?.pageSize || 10
    params.size = 10
    params.currentPage = page?.current || 1
    params.start = page?.current || 1
    setCurrent(page?.current || 1)
    setLoading(true)

    if (params.belongType === 'strategyMain') {
      const result = await searchReportMain(params)
      total = result.total
      setDataSource(result?.list)
    } else if (params.belongType === 'strategyChild') {
      const result = await searchStrategyChild(params)
      total = result.total
      setDataSource(result.list)
    } else {
      if (row) {
        const itemList = row?.requestParams.map((item: any) => ({
          [`periodStrategy-${item.periodStrategy}`]: item.periodStrategy,
        })).reduce(function (prev: number, curr: number) {
          return Object.assign(prev, curr)
        }, [])

        params.paramMap = { ...row, ...itemList }
      }
      params.code = 'period_strategy_details'
      setParamsList(params)
      const result = await getReportView(params)
      total = result.pageInfo.total
      detailList = Object.keys(result?.pageInfo.list[0] || {}).map((item : string, index: number) => ({
        title: <p style={{ width: '100px', textOverflow: 'ellipsis' }}>{detailCode[index]}</p>,
        dataIndex: item,
        key: item,
      }))
      setDataSource(result?.pageInfo.list || [])
    }
    setLoading(false)
  }

  async function searchPrimary (type?: any, row?: any) {
    setIsCreate(true)
    setStrategy({ ...strategy, isEdit: false, isCreate: false, isMainSearch: true })
    const result = await formInstance.validateFields()
    const params = {
      code: 'main_strategy',
      paramMap: {},
      size: 20,
      pageSize: 100,
      start: 1,
      versionCode: '0',
    }
    deptLevel = level
    if (type === 'isApply') {
      const applyList = await applyForm.validateFields()

      await toOtherStrategy({
        batchDeptIds: [{ deptId: applyList?.deptId?.split('-')[0], deptLevel: deptLevel }],
        contractIds: applyList.id ? [applyList.id] : [],
        cityIds: applyList.cityId,
        id: isApply?.id,
      })
      searchStrategy()
      message.success('应用成功')
      setIsApply(false)
    } else {
      setPrimaryParams({ ...result, deptLevel: level })
      deptId = result.deptId
      setLoading(true)

      params.paramMap = row
        ? { ...row, shopCityCode: row.cityId }
        : {
          ...result,
          deptId: result.deptId?.split('-')[0],
          deptLevel: result.deptId ? level : '',
        }

      const res = await getReportView(row ? { ...params, paramMap: params.paramMap } : params)
      if (res?.pageInfo.list[0]?.error === '参数错误') {
        message.info('暂无数据')
        res.pageInfo.list = []
      }
      setLoading(false)

      setColumnsMain(res?.pageInfo.list)
    }
  }

  const onload = async () => {
    await onLoadDetal({ ...paramsList, id: '1161659237631680512' })
    message.success('下载成功')
  }

  SearchColumns = [
    {
      title: '策略ID',
      dataIndex: 'id',
      key: 'id',
      render (record: any) {
        if (strategyTab === 'strategyMain') {
          return (
            <a onClick={async () => {
              const params = {
                strategyMainId: record,
              }
              setStrategyTab('strategyChild')
              searchFormRef.setFieldsValue({ belongType: 'strategyChild' })
              const result = await searchStrategyChild(params)
              setDataSource(result?.list)
            }}
            >{record}</a>
          )
        }
        return (<span>{record}</span>)
      },
    },
    {
      title: '策略名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '城市',
      dataIndex: 'cityName',
      key: 'cityName',
    },
    {
      title: '对象类型',
      dataIndex: 'strategyType',
      key: 'strategyType',
      render (record: number) {
        for (const item of strategyTypeOptions) {
          if (item.value === record) {
            return (<span>{item.label}</span>)
          }
        }
      },
    },
    {
      title: '策略分类',
      dataIndex: 'groupType',
      key: 'groupType',
      render () {
        return (<span>收入提升</span>)
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render () {
        return (<span>生效中</span>)
      },
    },
    {
      title: '创建人',
      dataIndex: 'creatorNickName',
      key: 'creatorNickName',
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      render (record: string) {
        return (<span>{dayjs(Number(record)).format('YYYY-MM-DD HH:mm')}</span>)
      },
    },
    {
      title: '生效日期',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '操作',
      key: 'config',
      className: 'td-line',
      width: strategyTab === 'strategyMain' ? 340 : 200,
      render (record: any, row: any) {
        if (strategyTab === 'strategyMain') {
          return (
            <>
              <a>查看预估效果</a> &nbsp;
              <a onClick={() => {
                history.push(`/datadecision/dashboard/detail?activeKey=${1}`)
                searchPrimary('', row).then(() => {
                  strategyCard(row)
                })
                setIsCreate(false)
                setStrategy({ ...row, isEdit: false, isMain: true })
                formInstance.setFieldsValue({ strategyType: row.strategyType })
              }}
              >编辑</a> &nbsp;
              <a
                onClick={async () => {
                  Modal.confirm({
                    icon: <ExclamationCircleOutlined />,
                    content: <h3>请确认同时删除主策略和子策略</h3>,
                    async onOk () {
                      await deleteStrategyMain(row.id)
                      message.success('删除成功')
                      searchStrategy()
                    },
                    okText: '确定',
                    cancelText: '取消',
                  })
                }}
              >删除</a> &nbsp;
              <a onClick={() => {
                setIsApply(row)
                applyForm.resetFields()
              }}
              >应用策略给其他对象</a>
            </>
          )
        }
        return (
          <>
            <a onClick={async () => {
              // 明细数据
              searchStrategy('detail', row)
              setStrategyTab('detail')
              searchFormRef.setFieldsValue({ belongType: 'detail' })
            }}
            >查看明细</a> &nbsp;
            <a onClick={async () => {
              await strategyCard(row)
              setStrategy({ ...row, isEdit: true, isCreate: true })
            }}
            >编辑</a> &nbsp;
            <a
              onClick={async () => {
                Modal.confirm({
                  icon: <ExclamationCircleOutlined />,
                  content: <h3>是否删除子策略</h3>,
                  async onOk () {
                    await deleteStrategyChild(row.id)
                    message.success('删除成功')
                    searchStrategy()
                  },
                  okText: '确定',
                  cancelText: '取消',
                })
              }}
            >删除</a> &nbsp;
          </>
        )
      },
    },
  ]

  useEffect(() => {
    window.onbeforeunload = function () {
      return 0
    }
  }, [strategy])

  // 主策略查询
  useEffect(() => {
    searchReportMain({ pageSize: 100, start: 1 }).then((res: { list: any }) => {
      setDataSource(res.list)
    })
  }, [formInstance])

  // 获取城市
  useEffect(() => {
    getCitys().then((res) => {
      setCityOptions(res)
    })
  }, [])

  // 子策略列表
  useEffect(() => {
    childCategaryList({}).then((res: any) => {
      let strategyList = []
      strategyList = res.map((item: { name: string; groupType: number; id: string }) => ({
        label: item.name,
        value: item.id,
        type: item.groupType,
      }))
      setStrategyOptions(strategyList)
    })
  }, [cardList])

  const content = useMemo(() => {
    return (
      <div>
        <p style={{ fontSize: '14px', color: '#bfbfbf' }}>收入提升类</p>
        <Checkbox.Group
          value={['1098147975937818624']}
          options={strategyOptions}
          // onChange={(value) => {
          //   // setChildStrategyOption(strategyOptions.filter((item: any) => value.includes(item.value)))
          //   setPrimaryParams({
          //     ...primaryParams,
          //     strategyOptions: strategyOptions.filter((item: any) => value.includes(item.value)),
          //   })
          // }}
        />
      </div>
    )
  }, [strategyOptions])

  const deleted = async (strategyMainId: any) => {
    await deleteStrategyMain(strategyMainId)
    reset()
    searchPrimary()
  }

  SearchColumns = useMemo(() => {
    if (strategyTab === 'strategyMain') {
      return SearchColumns.filter((item: any) => {
        return !['sonStrategyName', 'groupType', 'type', 'startTime'].includes(item.key)
      })
    } else if (strategyTab === 'strategyChild') {
      return SearchColumns.filter((item: any) => {
        return !['objectType', 'startTime'].includes(item.key)
      })
    }
    return detailList
  }, [dataSource])

  const addStrategy = useCallback(async () => {
    console.log('<<<<', { ...strategy }, '>>>>>', { ...primaryParams })
    setStrategy({ ...strategy, ...primaryParams as any, isCreate: true })
  }, [primaryParams])

  const strategyChange = (e: any) => {
    setStrategyTab(e.target.value)
    searchStrategy()
    searchFormRef.resetFields()
    searchFormRef.setFieldsValue({ belongType: e.target.value })
  }

  const selectCreate = async (e: { target: { value: any } }) => {
    setCreateType(e.target.value)
    applyForm.setFieldsValue({ id: '', deptId: '', cityId: [] })
  }

  // 应用策略给其他对象
  const applyStrategy = async () => {
    await searchPrimary('isApply')
  }

  const fetch = async (nodeKey: any) => {
    let params = {}
    if (nodeKey) {
      const [departmentId, userId, organization] = nodeKey.split('-')
      params = { departmentId, userId, organization: organization || null }
    }
    const data = await getDepById(params)
    const map: any[] = []
    data.forEach((item : any) => {
      const { organization, departmentId, departmentName, userId, nickName, role, hasChildren } = item
      const id = `${departmentId || ''}-${userId || ''}-${nickName || departmentName || ''}-${organization || ''}-${role || ''}`
      const orgNode = {
        id,
        parentId: nodeKey || null,
        key: id,
        value: id,
        role,
        organization: item.organization,
        title: departmentName ? `${departmentName}-${nickName}` : nickName,
        isLeaf: !hasChildren,
        children: [],
      }
      map.push(orgNode)
    })
    return map
  }

  useEffect(() => {
    fetch(0).then((data) => {
      setTreeMap(data)
    })
  }, [])

  function merge (oldDate: any, newDate: string | any[]) {
    const data = [...oldDate]
    if (newDate.length) {
      data.forEach((item) => {
        if (item.id === newDate[0].parentId) {
          item.children = newDate.slice(1)
        }
        if (item.children.length) {
          item.children = merge(item.children, newDate)
        }
      })
    }
    return data
  }

  const loadChildren = async (node: any) => {
    const data = await fetch(node?.value)
    setTreeMap(merge(treeMap, data))
  }

  // 保存新建策略
  async function reult () {
    let result = {}
    const { shopCityCode, estimateId, contractId } = await formInstance.validateFields()
    if (strategy?.isMain) {
      if (strategy?.isMain && strategy?.isMainSearch) {
        result = await mainUpdate({
          id: strategy?.id,
          contractId,
          estimateId,
          cityId: shopCityCode,
          deptId: deptId?.split('-')[0],
          deptLevel: deptLevel,
        })
      } else {
        result = await mainUpdate({
          ...strategy,
        })
      }
    } else {
      result = await getStrategyMain({
        contractId, estimateId, cityId: shopCityCode, deptId: deptId?.split('-')[0], deptLevel: deptLevel,
      })
      message.success('保存成功')
    }
    strategyCard()
    setIsCreate(false)
    const list = { ...strategy, ...primaryParams, strategyMainId: result }
    setStrategy(list as any)
    setPrimaryParams(list)
  }
  const add = () => {
    setNum(state => {
      return state++
    })
  }

  const jian = () => {
    setNum(state => {
      return state--
    })

  const clear = () => {
    formInstance.resetFields()
  }

  return (
    <div>
      <Tabs
        className="strategy-tabs"
        activeKey={activeKey}
        onChange={(item) => {
          history.push(`/datadecision/dashboard/detail?activeKey=${item}`)
          setStrategyTab('strategyMain')
          setCreateType(1)
          reset()
          formInstance.setFieldsValue({ strategyType: 1 })
          searchFormRef.setFieldsValue({ belongType: 'strategyMain' })
        } }
      />
        <TabPane tab="策略创建" key="1">
          <Form
            {...formLayout}
            form={formInstance}
            layout="inline"
            className="strategy"
            style={{ backgroundColor: 'white' }}
          >
            <Col span={24} style={{ marginBottom: '15px' }}>
              <Form.Item label="所属类目" name="strategyType" initialValue={createType}>
                <Radio.Group onChange={selectCreate as any}>
                  <Radio.Button value={1}>组织架构</Radio.Button>
                  <Radio.Button value={2}>城市</Radio.Button>
                  <Radio.Button value={3}>合同/测算</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            {createType === 1 && <Col span={8}>
              <Form.Item label="组织架构" name="deptId">
                <TreeSelect
                  placeholder="请输入组织架构"
                  loadData={loadChildren}
                  treeData={treeMap}
                  onSelect={(_, node) => {
                    setLevel(node.role)
                  } }
                  allowClear />
              </Form.Item>
            </Col>}
            {createType === 2 && <Col span={8}>
              <Form.Item label="城市" name="shopCityCode">
                <TreeSelect
                  placeholder="请输入城市"
                  treeData={cityOptions || []}
                  allowClear />
              </Form.Item>
            </Col>}
          {createType === 3 && <Col span={8}>
            <Form.Item label="测算" name="estimateId">
              <Input placeholder="请输入测算" allowClear />
            </Form.Item>
          </Col>}
          {createType === 3 && <Col span={8}>
            <Form.Item label="合同ID" name="contractId">
              <Input placeholder="请输入合同ID" allowClear />
            </Form.Item>
          </Col>}
          {createType !== 3 && <Col span={8}>
            <Form.Item label="直营/渠道" name="cls">
              <Input placeholder="请输入直营/渠道" allowClear />
            </Form.Item>
          </Col>}
          <Row gutter={16}>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button onClick={reset}>重置</Button>
              <Button type="primary" onClick={() => searchPrimary()} style={{ marginLeft: 10 }}>查询</Button>
            </Col>
          </Row>
        </Form>
        <div className="strategy-title">
          <h3>策略列表</h3>
          <Popover placement="leftBottom" content={content} trigger="hover">
            <Button type="primary" style={{ marginRight: '10px' }} onClick={addStrategy} disabled={isCreate}>新建</Button>
          </Popover>
        </div>
        <Table
          scroll={{ x: 1300 }}
          columns={DetailData(strategy, deleted, primaryParams, reult)}
          dataSource={columnsMain}
          loading={loading} />
      </TabPane><TabPane tab="策略查询" key="2">
        <Form
          {...formLayout}
          form={searchFormRef}
          layout="inline"
          className="strategy"
          style={{ backgroundColor: 'white' }}
        >
          <Col span={24} style={{ marginBottom: '15px' }}>
            <Form.Item label="所属类目" name="belongType" initialValue={strategyTab}>
              <Radio.Group onChange={strategyChange}>
                <Radio.Button value="strategyMain">主策略</Radio.Button>
                <Radio.Button value="strategyChild">子策略</Radio.Button>
                <Radio.Button value="detail">明细数据</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={8} style={{ marginBottom: '15px' }}>
            <Form.Item label="策略ID" name="id">
              <Input placeholder="请输入策略ID" style={{ marginLeft: '15px' }} allowClear />
            </Form.Item>
          </Col>
          <Col span={8} style={{ marginBottom: '15px' }}>
            <Form.Item label="创建日期" name="createDate">
              <RangePicker placeholder={['开始时间', '结束时间']} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ marginBottom: '15px' }}>
            <Form.Item label="状态" name="status">
              <Select placeholder="状态" style={{ marginLeft: '15px' }} options={statuOptions} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ marginBottom: '15px' }}>
            <Form.Item label="选择城市" name="cityId">
              <TreeSelect
                placeholder="请输入城市"
                treeData={cityOptions || []}
                allowClear />
            </Form.Item>
          </Col>
          {strategyTab === 'strategyChild' && <Col span={8} style={{ marginBottom: '15px' }}>
            <Form.Item label="类型" name="strategyType">
              <Select placeholder="请输入对象类型" options={strategyTypeOptions} allowClear />
            </Form.Item>
          </Col>}
          <Col span={8}>
            <Form.Item label="创建人" name="creatorNickName">
              <Input placeholder="请输入创建人" allowClear />
            </Form.Item>
          </Col>
          {strategyTab === 'detail' && <Col span={8}>
            <Form.Item label="子策略" name="strategySon">
              <Input placeholder="请输入子策略" allowClear />
            </Form.Item>
          </Col>}
          {strategyTab !== 'strategyChild' && <Col span={8}>
            <Form.Item label="对象类型" name="strategyType">
              <Select placeholder="请输入对象类型" options={strategyTypeOptions} allowClear />
            </Form.Item>
          </Col>}
          <Col span={24} style={{ textAlign: 'right', marginTop: '10px' }}>
            {strategyTab === 'detail' && <Button onClick={onload}>下载</Button>}
            <Button onClick={reset} style={{ marginLeft: 10 }}>重置</Button>
            <Button type="primary" onClick={searchStrategy as any} style={{ marginLeft: 10, marginRight: 70 }}>查询</Button>
          </Col>
        </Form>
        <h3>{strategyTab !== 'detail' ? '策略列表' : '门店&合同明细数据'}</h3>
        <Table
          scroll={{ x: 1600 }}
          pagination={{
            pageSize: 10,
            total,
            current,
          }}
          onChange={(page) => {
            searchStrategy('', '', page as any)
          } }
          columns={SearchColumns}
          dataSource={dataSource}
          loading={loading} />
      </TabPane>
    <Modal
      getContainer={false}
      title="应用策略给其他对象"
      cancelText="取消"
      okText="确认应用"
      visible={isApply}
      onOk={applyStrategy}
      onCancel={() => { setIsApply(false) } }
    >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          form={applyForm}
        >
          <Form.Item label="所属类目" name="strategyType" initialValue={createType}>
            <Radio.Group onChange={selectCreate as any}>
              <Radio.Button value={1}>组织架构</Radio.Button>
              <Radio.Button value={2}>城市</Radio.Button>
              <Radio.Button value={3}>合同/测算</Radio.Button>
            </Radio.Group>
          </Form.Item>
          {createType === 3 && <Form.Item label="测算ID/合同" name="id" rules={[{ required: true, message: '请输入测算ID/合同' }]}>
            <Input placeholder="请输入测算ID/合同" />
          </Form.Item>}
          {createType === 1 && <Form.Item label="组织架构" name="deptId" rules={[{ required: true, message: '请选择组织架构' }]}>
            <TreeSelect
              placeholder="请选择组织架构"
              loadData={loadChildren}
              treeData={treeMap}
              onSelect={(_, node) => {
                setLevel(node.role)
              } } />
          </Form.Item>}
          {createType === 2 && <Form.Item
            label="选择城市(多选)"
            name="cityId"
            rules={[{ required: true, message: '请选择城市' }]}
          >
            <TreeSelect
              placeholder="请输入城市"
              treeData={cityOptions}
              multiple
              allowClear />
          </Form.Item>}
        </Form>
      </Modal>
      <ModalCard
        cardList={cardList}
        strategy={strategy}
        searchStrategy={searchStrategy}
        strategyOptions={strategyOptions}
        cancel={() => {
          Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: <div><h3>请先保存策略再退出</h3>
              <p style={{ color: 'rgb(0 0 0 / 45%)' }}>你的主策略还没建完，退出后您可在策略列表查看和重新编辑该策略。</p>
            </div>,
            onOk() {
              setStrategy({ ...strategy, isCreate: false } as any)
            },
            okText: '继续退出',
            cancelText: '取消',
          })
        } }
        onOk={() => {
          setStrategy(false)
        }} />
    </div>
  )
}

export default Dashboard