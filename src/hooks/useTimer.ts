import { useEffect, useRef, useState } from "react";

export interface UseTimerReturn {
	time: number;
	isRunning: boolean;
	isFinished: boolean;
	startTimer: () => void;
	stopTimer: () => void;
}

/**
 *
 * @param initialSeconds number, just in second
 *
 * **Returned object:**
 * - `time`: Current remaining time in seconds
 * - `isRunning`: Whether the timer is running
 * - `isFinished`: Whether the timer has completed
 * - `startTimer()`: Starts or restarts the timer
 * - `stopTimer()`: Stops and clears the timer
 */
export function useTimer(initialSeconds: number): UseTimerReturn {
	const [time, setTime] = useState<number>(initialSeconds);
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const [isFinished, setIsFinished] = useState<boolean>(false);

	/**
	 * @description I changed the interval variable(which were defined outside of component)
	 * to a ref, so we can use this hook multiple times without any bug
	 */
	const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const clearTimer = () => {
		if (!intervalRef.current) {
			return;
		}

		clearInterval(intervalRef.current);
		intervalRef.current = null;
	};

	const startTimer = () => {
		clearTimer();
		setTime(initialSeconds);
		setIsFinished(false);
		setIsRunning(true);
	};

	const stopTimer = () => {
		clearTimer();
		setIsRunning(false);
	};

	useEffect(() => {
		if (!isRunning) {
			return;
		}

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

		return () => clearTimer();
	}, [isRunning]);

	return {
		time,
		isRunning,
		isFinished,
		startTimer,
		stopTimer,
	};
}
