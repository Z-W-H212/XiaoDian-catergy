import { useEffect } from 'react'
import * as echarts from 'echarts'

const ExcludeCard = function (props: any) {
  const { id, params } = props
  const options: any = {
    typeId: '',
    tags: [],
    barData: [],
    lineData: [],
  }
  params.forEach((item: any) => {
    options.tags.push(item.catename)
    options.barData.push(item.shopcount)
    options.lineData.push(Number(item.chrgdurnavg).toFixed(2))
  })
  useEffect(() => {
    const chartDom = document.getElementById(id || 'main')
    const myChart = chartDom && echarts.init(chartDom)
    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['门店数', '平均时长'],
      },
      xAxis: [
        {
          type: 'category',
          axisLabel: {
            rotate: -45,
          },
          data: options.tags,
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          // min: 0,
          // max: 250,
          interval: 50000,
          axisLabel: {
            formatter: '{value}',
          },
        },
        {
          type: 'value',
          max: 250,
          interval: 50,
          axisLabel: {
            formatter: '{value}',
          },
        },
      ],
      series: [
        {
          name: '门店数',
          type: 'bar',
          barWidth: '25px',
          data: options.barData,
        },
        {
          name: '平均时长',
          type: 'line',
          yAxisIndex: 1,
          data: options.lineData,
        },
      ],
    }
    chartDom && myChart?.setOption(option)
  }, [id, params])
  return (
    <div id={id || 'main'} className="echarts-price" style={{ width: '550px', height: '200px' }} />
  )
}

export default ExcludeCard
