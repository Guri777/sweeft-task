import { useEffect, useState } from "react"

export const Usedebounce = (value,delay)=>{
    const [debounce,setDebounce] = useState(value)
    useEffect(()=>{
        const handler = setTimeout(()=>{
            setDebounce(value)
        },delay)
        return ()=>{
            clearTimeout(handler)
        }
    },[delay,value])
    return debounce
}