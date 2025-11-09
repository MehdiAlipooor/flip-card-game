import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { Alert, Button, TileCard } from "./components";
import type { TileType } from "./constants";
import { useGameCore } from "./hooks/useGameCore";

type TileItem = TileType & { id: number };

function App() {
	const [isGameStarted, setIsGameStarted] = useState(false);

	const {
		tiles,
		onTileClick,
		isTileActive,
		isFinished,
		isTileDisabled,
		handleStart,
		isInitialViewActive,
		time,
		clickCount,
		selectedTiles,
		matchedTiles
	} = useGameCore();

	useEffect(() => {
		if (!isFinished) {
			return;
		}
	}, [isFinished]);

	const renderTileItem = useCallback((tile: TileItem, index: number) => {
		return (
			<TileCard
				key={index}
				icon={tile.icon}
				isActive={isTileActive(index)}
				isDisabled={isTileDisabled(tile.icon) || isInitialViewActive}
				onClick={() => onTileClick({ ...tile, id: index })}
			/>
		);
	},[isInitialViewActive, selectedTiles, matchedTiles, isFinished])

	const tilesList = tiles.map(renderTileItem);

	const onStartClick = () => {
		setIsGameStarted(true);
		setTimeout(() => handleStart(), 2000);
	};

	return (
		<div className="main">
			<Alert />
			<div className={`body ${isGameStarted && "active"}`}>
				<div className="control-section">
					<div className="inner">
						<p>به بازی کارت ها خوش اومدی</p>
						<Button
							title={isFinished ? "بازی دوباره" : "شروع بازی"}
							onClick={onStartClick}
							type="danger"
						/>
					</div>
				</div>
				<div className="wrapper">
						<ul className="status">
							<li>
								<p>{time}</p>
								<p>زمان</p>
							</li>
							<li>
								<p>{clickCount}</p>
								<p>تعداد حرکات مجاز</p>
							</li>
						</ul>
					<div className="wrapper-grid">
						{tilesList}
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
