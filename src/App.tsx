import { useEffect, useState } from "react";
import "./App.css";
import { Alert, TileCard } from "./components";
import type { TileType } from "./constants";
import { useGameCore } from "./hooks/useGameCore";
import { useShowAlert } from "./hooks";

type TileItem = TileType & { id: number };

function App() {
	const [isGameStarted, setIsGameStarted] = useState(false);

	// const { show: showAlert, hide: hideAlert } = useShowAlert();

	const {
		tiles,
		onTileClick,
		isTileActive,
		isFinished,
		isTileDisabled,
		handleStart,
		isInitialViewActive,
		restartGame,
	} = useGameCore();

	useEffect(() => {
		if (!isFinished) {
			return;
		}

		// showAlert();
	}, [isFinished]);

	const renderTileItem = (tile: TileItem, index: number) => {
		return (
			<TileCard
				key={index}
				icon={tile.icon}
				isActive={isTileActive(index)}
				isDisabled={isTileDisabled(tile.icon) || isInitialViewActive}
				onClick={() => onTileClick({ ...tile, id: index })}
			/>
		);
	};

	const tilesList = tiles.map(renderTileItem);

	const onStartClick = () => {
		setIsGameStarted(true);
		setTimeout(() => handleStart(), 2000);
	};

	const onAlertConfim = () => {
		// hideAlert();

		restartGame();
	};

	return (
		<div className="main">
			<Alert />
			<div className={`body ${isGameStarted && "active"}`}>
				<div className="control-section">
					<div className="inner">
						<p>به بازی کارت ها خوش اومدی</p>
						<button className="danger-button" onClick={onStartClick}>
							{!isFinished ? "شروع بازی" : "بازی دوباره"}
						</button>
					</div>
				</div>
				<div className="wrapper">{tilesList}</div>
			</div>
		</div>
	);
}

export default App;
