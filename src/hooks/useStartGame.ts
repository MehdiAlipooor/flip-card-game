import { useState } from "react";

export const useStartGame = (
	isTimeRunning: boolean,
	startTimehandler: () => void,
) => {
	const [isInitialViewActive, setIsInitialViewActive] = useState(false);

	const showInitialActiveTiles = () => setIsInitialViewActive(true);
	const hideInitialActiveTiles = () => {
		setTimeout(() => {
			setIsInitialViewActive(false);
		}, 3000);
	};

	const onStart = () => {
		if (isTimeRunning) {
			return;
		}

		showInitialActiveTiles();
		hideInitialActiveTiles();

		startTimehandler();
	};

	return { isInitialViewActive, onStart };
};
