import React, {
	createContext,
	useContext,
	useState,
	type ReactNode,
} from "react";

interface AlertOptions {
	message: string;
	type?: "danger" | "success";
	onConfirm?: () => void;
}

interface AlertContextType {
	showAlert: (options: AlertOptions) => void;
	hideAlert: () => void;
	alert: AlertOptions | null;
	visible: boolean;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [alert, setAlert] = useState<AlertOptions | null>(null);
	const [visible, setVisible] = useState(false);

	const showAlert = (options: AlertOptions) => {
		setAlert(options);
		setVisible(true);
	};

	const hideAlert = () => {
		setVisible(false);
		setTimeout(() => setAlert(null), 300);
	};

	return (
		<AlertContext.Provider value={{ showAlert, hideAlert, alert, visible }}>
			{children}
		</AlertContext.Provider>
	);
};

export const useAlert = () => {
	const context = useContext(AlertContext);
	if (!context) throw new Error("useAlert must be wrapped in AlertProvider");
	return context;
};
