import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'

/**
 * 自定义hooks 获取url参数
 * @returns {searchObj} url参数
 */
export default function useParseSearch () {
  const { search } = useLocation()

  return useMemo(() => {
    const searchObj = search ? queryString.parse(search.replace(/\+/g, '@@')) : {}
    Object.keys(searchObj).forEach((key) => {
      typeof searchObj[key] === 'string' && (searchObj[key] = searchObj[key].replace(/@@/g, '+'))
    })

    return searchObj
  }, [search])
}
