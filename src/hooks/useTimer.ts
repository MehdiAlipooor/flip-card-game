import { useEffect, useRef, useState } from "react";

export interface UseTimerReturn {
  time: number;
  isRunning: boolean;
  isFinished: boolean;
  startTimer: () => void;
  stopTimer: () => void;
  restartTimer: () => void;
}

export function useTimer(initialSeconds: number, delay = 0): UseTimerReturn {
  const [time, setTime] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startCountdown = () => {
    clearTimer();

    intervalRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startTimer = () => {
    clearTimer();
    if (delay > 0) {
      setTimeout(() => {
        setTime(initialSeconds);
        setIsFinished(false);
        setIsRunning(true);
        startCountdown();
      }, delay);
    } else {
      setTime(initialSeconds);
      setIsFinished(false);
      setIsRunning(true);
      startCountdown();
    }
  };

  const restartTimer = () => {
    clearTimer();
    setTime(initialSeconds);
    setIsFinished(false);
    setIsRunning(true);
    startCountdown();
  };

  const stopTimer = () => {
    clearTimer();
    setIsRunning(false);
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  return {
    time,
    isRunning,
    isFinished,
    startTimer,
    stopTimer,
    restartTimer,
  };
}
