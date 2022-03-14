/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { dcapi } from '@/utils/request'

// 获取城市信息
export async function getCitys (): Promise<any> {
  const data = await dcapi.get('diana/city/permission/findUserCityPermission')
  return data
}

// 获取组织架构信息
export function getDepById (params: any) {
  return dcapi.post('/diana/data/permission/getByDepRpc', params)
}

// 策略查询保存
export function getStrategyMain (params: any) {
  return dcapi.post('/diana/cityStrategyMain/insert', params)
}

// 报表查询
export function getReportView (params: any) {
  return dcapi.post('/diana/query/v1/reportPreviewByCode', params)
}

// 报表下载
export function onLoadDetal (params: any) {
  return dcapi.post('/diana/query/v1/downloadReport', params)
}

// 主策略查询
export function searchReportMain (params: any) {
  return dcapi.post('/diana/cityStrategyMain/list', params)
}

// 主策略修改
export function mainUpdate (params: any) {
  return dcapi.post('/diana/cityStrategyMain/updateById', params)
}

// 主策略删除
export function deleteStrategyMain (id: number) {
  return dcapi.get(`/diana/cityStrategyMain/deleteById/${id}`)
}

// 应用策略给其他对象
export function toOtherStrategy (params: any) {
  return dcapi.post('/diana/cityStrategyMain/toOther', params)
}

// 创建子策略
export function createStrategyChild (params: any) {
  return dcapi.post('/diana/cityStrategyChild/insert', params)
}

// 子策略修改
export function updateStrategyChild (params: any) {
  return dcapi.post('/diana/cityStrategyChild/updateById', params)
}

// 子策略删除
export function deleteStrategyChild (id: number) {
  return dcapi.get(`/diana/cityStrategyChild/deleteById/${id}`)
}

// 子策略查询
export function searchStrategyChild (params: any) {
  return dcapi.post('/diana/cityStrategyChild/list', params)
}

// 策略集创建
export function childCategaryUpdate (params: any) {
  return dcapi.post('/diana/cityStrategyChildCategary/updateById', params)
}

// 策略集删除
export function childCategaryDelete (id: number) {
  return dcapi.get(`/diana/cityStrategyChildCategary/deleteById/${id}`)
}

// 策略集查询
export function childCategaryList (params: any) {
  return dcapi.post('/diana/cityStrategyChildCategary/list', params)
}

// 子策略报表
export function childCategaryReport (params: any) {
  return dcapi.post('/diana/query/v1/reportPreview', params)
}

// 明细报表配置
export function getDetailReportConfig (params: any) {
  return dcapi.post('/diana/report/v1/getPreviewConfigByCode', params)
}

// 主策略查子策略
export function findById (id: number) {
  return dcapi.get(`/diana/cityStrategyChild/findById/${id}`)
}
