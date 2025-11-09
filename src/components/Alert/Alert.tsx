import { useEffect, useState } from "react";
import "./styles.css";
import { useAlert } from "../../context";
import { Button } from "../Button";

export const Alert = () => {
	const { alert, visible, hideAlert } = useAlert();
	const [open, setOpen] = useState(false);

	useEffect(() => {
		visible ? setTimeout(() => setOpen(true), 20) : setOpen(false);
	}, [visible]);

	if (!alert) {
		return null;
	}

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
				<Button
					type={alert.type || "danger"}
					onClick={handleClose}
					title={alert.title}
				/>
			</div>
		</div>
	);
};
