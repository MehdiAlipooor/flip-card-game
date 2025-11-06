import { useMemo, useState } from "react";


let timerInterval: ReturnType<typeof setInterval>

export function useTimer(initialTimeout: number){
    const [time, setTime] = useState(initialTimeout)

    function startTime(){
      timerInterval = setInterval(() => {
        setTime((prev)=> {
          if(prev === 0){
            clearInterval(timerInterval)
            return 0
          }

          return prev -1
        })
      }, 1000);
    }

    const isFinished = useMemo(() => time === 0,[time])

    return { time, startTime, isFinished}
}