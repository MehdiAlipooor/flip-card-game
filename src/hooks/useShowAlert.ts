import { useState } from "react";

export const useShowAlert = () => {
	const [isAlertVisible, setIsAlertVisible] = useState(false);

	const show = () => setIsAlertVisible(true);
	const hide = () => setIsAlertVisible(false);

	return { isAlertVisible, show, hide };
};
