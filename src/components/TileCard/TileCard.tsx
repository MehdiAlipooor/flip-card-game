import "./styles.css";

interface Props {
	onClick: () => void;
	isActive: boolean;
	icon: string;
	isDisabled: boolean;
}

export function TileCard({ onClick, isActive, icon, isDisabled }: Props) {
	return (
		<div
			className={`tile ${isActive ? "flipped" : ""}`}
			onClick={() => !isDisabled && onClick()}
		>
			<div className="tile-face tile-back" />
			<div className="tile-face tile-front">
				<img src={icon} alt="tile icon" />
			</div>
		</div>
	);
}
