import "./App.css";
import { TileCard } from "./components";
import type { TileType } from "./constants";
import { useGameCore } from "./hooks/useGameCore";

type TileItem = TileType & { id: number };

function App() {
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

	return (
		<div className="body">
			<button onClick={handleStart}>شروع</button>
			<br />
			<div className="wrapper">{tilesList}</div>
		</div>
	);
}

export default App;
