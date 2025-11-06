import { useState } from "react";
import "./App.css";
import { TileCard } from "./components";
import type { TileType } from "./constants";
import { useGameCore } from "./hooks/useGameCore";

type TileItem = TileType & { id: number };

function App() {
	const [isGameStarted, setIsGameStarted] = useState(false);
	
	const { tiles, onTileClick, isTileActive, isTileDisabled, handleStart } =
		useGameCore();

	const renderTileItem = (tile: TileItem, index: number) => {
		return (
			<TileCard
				key={index}
				icon={tile.icon}
				isActive={isTileActive(index)}
				isDisabled={isTileDisabled(tile.icon)}
				onClick={() => onTileClick({ ...tile, id: index })}
			/>
		);
	};

	const tilesList = tiles.map(renderTileItem);

	const onStartClick = () => {
		setIsGameStarted(true)
		setTimeout(() =>handleStart(), 2000)
	}

	return (
		<div className={`body ${isGameStarted && 'active'}`}>
			<div className="control-section">
				<div className="inner">
					<p>به بازی کارت ها خوش اومدی</p>
					<button onClick={onStartClick}>شروع بازی</button>
				</div>
			</div>
			<div className="wrapper">{tilesList}</div>
		</div>
	);
}

export default App;
