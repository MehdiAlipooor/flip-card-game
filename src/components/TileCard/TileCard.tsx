import "./tiles.css";

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
      {/* Back side (hidden side) */}
      <div className="tile-face tile-back" />

      {/* Front side (image) */}
      <div className="tile-face tile-front">
        <img src={icon} alt="tile icon" />
      </div>
    </div>
  );
}
