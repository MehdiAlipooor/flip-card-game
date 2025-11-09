import { useEffect, useState } from "react";
import "./styles.css";
import { useAlert } from "../../context/AlertContex";

export const Alert = () => {
	const { alert, visible, hideAlert } = useAlert();
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (visible) {
			setTimeout(() => setOpen(true), 20);
		} else {
			setOpen(false);
		}
	}, [visible]);

	if (!alert) return null;

	const handleClose = () => {
		setOpen(false);

		setTimeout(() => {
			hideAlert();
			alert.onConfirm?.();
		}, 300);
	};

	return (
		<div className={`overlay ${open ? "open" : "close"}`}>
			<div
				className={`alert-body ${alert.type || "danger"} ${open ? "show" : "hide"}`}
			>
				<p className="title">{alert.message}</p>
				<button
					className={`${alert.type || "danger"}-button`}
					onClick={handleClose}
				>
					شروع دوباره
				</button>
			</div>
		</div>
	);
};
