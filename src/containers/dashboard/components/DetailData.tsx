import { useMemo } from 'react'
import { message } from 'antd'

type Column = {
  title?: string,
  dataIndex?: string,
  key?: any,
  width?: number,
  fixed?: string,
  render?: (record: number | any, row?: any) => JSX.Element
}

export function DetailData (strategy: any, deleted: any, props: any, reult: any) : [] {
  const { strategyType } = props
  let columns: Column[] = [
    {
      title: '策略名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '类型',
      dataIndex: 'strategytype',
      key: 'strategytype',
      width: 150,
    },
    {
      title: '测算ID',
      dataIndex: 'estimateid',
      key: 'estimateid',
      width: 150,
    },
    {
      title: '合同ID',
      dataIndex: 'contractid',
      key: 'contractid',
      width: 150,
    },
    {
      title: '城市数量',
      dataIndex: 'citycount',
      key: 'citycount',
      width: 150,
    },
    {
      title: '测算数量',
      dataIndex: 'estimatecount',
      key: 'estimatecount',
      width: 150,
    },
    {
      title: '合同数量',
      dataIndex: 'contractcount',
      key: 'contractcount',
      width: 150,
    },
    {
      title: '门店数量',
      dataIndex: 'shopcount',
      key: 'shopcount',
      width: 150,
    },
    {
      title: '毛利率',
      dataIndex: 'grossprofitrate',
      key: 'grossprofitrate',
      width: 150,
      render (record: number | any) {
        return <span>{`${record.toFixed(4) * 100}%`}</span>
      },
    },
    {
      title: '上月毛利率',
      dataIndex: 'lastmonthgrossprofitrate',
      key: 'lastmonthgrossprofitrate',
      width: 150,
      render (record: number | any) {
        return <span>{`${record.toFixed(4) * 100}%`}</span>
      },
    },
    {
      title: '总计毛利率',
      dataIndex: 'totalgrossprofitrate',
      key: 'totalgrossprofitrate',
      width: 150,
      render (record: number | any) {
        return <span>{`${record.toFixed(3) * 100}%`}</span>
      },
    },
    {
      title: '毛利',
      dataIndex: 'grossprofit',
      key: 'grossprofit',
      width: 150,
    },
    {
      title: '上月毛利',
      dataIndex: 'lastmonthgrossprofit',
      key: 'lastmonthgrossprofit',
      width: 150,
    },
    {
      title: '总计毛利',
      dataIndex: 'totalgrossprofit',
      key: 'totalgrossprofit',
      width: 150,
    },
    {
      title: '成功订单金额',
      dataIndex: 'successorderamount',
      key: 'successorderamount',
      width: 150,
    },
    {
      title: '上月成功订单金额',
      dataIndex: 'lastmonthsuccessorderamount',
      key: 'lastmonthsuccessorderamount',
      width: 150,
    },
    {
      title: '总计成功订单金额',
      dataIndex: 'totalsuccessorderamount',
      key: 'totalsuccessorderamount',
      width: 150,
    },
    {
      title: '收入',
      dataIndex: 'orderincome',
      key: 'orderincome',
      width: 150,
    },
    {
      title: '上月收入',
      dataIndex: 'lastmonthorderincome',
      key: 'lastmonthorderincome',
      width: 150,
    },
    {
      title: '总计收入',
      dataIndex: 'totalorderincome',
      key: 'totalorderincome',
      width: 150,
    },
    {
      title: '进场费摊销',
      dataIndex: 'admissionamount',
      key: 'admissionamount',
      width: 150,
    },
    {
      title: '上月进场费摊销',
      dataIndex: 'lastmonthadmissionamount',
      key: 'lastmonthadmissionamount',
      width: 150,
    },
    {
      title: '总计进场费摊销',
      dataIndex: 'totaladmissionamount',
      key: 'totaladmissionamount',
      width: 150,
    },
    {
      title: '分成',
      dataIndex: 'divideamount',
      key: 'divideamount',
      width: 150,
    },
    {
      title: '上月分成',
      dataIndex: 'lastmonthdivideamount',
      key: 'lastmonthdivideamount',
      width: 150,
    },
    {
      title: '总计分成',
      dataIndex: 'totaldivideamount',
      key: 'totaldivideamount',
      width: 150,
    },
    {
      title: '资金利息',
      dataIndex: 'capitalinterest',
      key: 'capitalinterest',
      width: 150,
    },
    {
      title: '上月资金利息',
      dataIndex: 'lastmonthcapitalinterest',
      key: 'lastmonthcapitalinterest',
      width: 150,
    },
    {
      title: '总计资金利息',
      dataIndex: 'totalcapitalinterest',
      key: 'totalcapitalinterest',
      width: 150,
    },
    {
      title: '设备摊销',
      dataIndex: 'equipmentamortize',
      key: 'equipmentamortize',
      width: 150,
    },
    {
      title: '上月设备摊销',
      dataIndex: 'lastmonthequipmentamortize',
      key: 'lastmonthequipmentamortize',
      width: 150,
    },
    {
      title: '总计设备摊销',
      dataIndex: 'totalequipmentamortize',
      key: 'totalequipmentamortize',
      width: 150,
    },
    {
      title: '售宝成本',
      dataIndex: 'salecost',
      key: 'salecost',
      width: 150,
    },
    {
      title: '上月售宝成本',
      dataIndex: 'lastmonthsalecost',
      key: 'lastmonthsalecost',
      width: 150,
    },
    {
      title: '总计售宝成本',
      dataIndex: 'totalsalecost',
      key: 'totalsalecost',
      width: 150,
    },
    {
      title: '操作',
      key: 'config',
      width: 150,
      fixed: 'right',
      render (_record: any, row: any) {
        return (
          <>
            <a
              onClick={() => {
                reult(row)
              }}
            >保存</a>&nbsp;
            <a
              style={{ display: `${strategy ? '' : 'none'}` }}
              onClick={async () => {
                deleted(strategy?.strategyMainId)
                message.success('删除成功')
              }}
            >|&nbsp;删除</a>
          </>
        )
      },
    },
  ]

  columns = useMemo(() => {
    if (strategyType === 1) {
      return columns.filter((item) => {
        return !['estimateid', 'contractid', 'citycount'].includes(item.key)
      })
    } else if (strategyType === 2) {
      return columns.filter((item) => {
        return !['estimateid', 'contractid', 'citycount', 'deptid'].includes(item.key)
      })
    }
    return columns.filter((item) => {
      return !['city', 'deptid'].includes(item.key)
    })
  }, [strategyType, strategy])

  return columns as []
}
