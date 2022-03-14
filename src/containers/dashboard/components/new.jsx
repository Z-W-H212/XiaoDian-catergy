
import { useState } from "react"
import { Input, Button, } from 'antd'


const NewList = () => { 
    const [num, setNum] = useState(1)

    const add = () => {
        let list = num
        list += 1
        setNum(list)
    }
    const jian = () => {
        let list = num
        list -= 1
        setNum(list)
    }

    const clear = () => {
        setNum('')
    }
    return (
        <div>
            <Input value={num}/><Button onClick={add}>+</Button><Button onClick={jian}>-</Button><Button onClick={clear}>清空</Button>
            当前值：{num}
        </div>
    )
}

export default NewList