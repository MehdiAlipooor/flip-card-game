import "./App.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { TileCard } from "./components";
import type { TileType } from "./constants";
import { useStartGame, useTimer } from "./hooks";
import { generateRandomTiles } from "./utils";
import { GAME_CONFIG } from "./config";

type TileItem = TileType & { id: number };
type SelectedItems = {
	itemOne: TileItem;
	itemTwo: TileItem;
};

function App() {
	const tiles = useMemo(() => generateRandomTiles(), []);

	const {
		startTimer: startTime,
		isFinished,
		isRunning,
	} = useTimer(GAME_CONFIG.ALLOWABLE_TIME);

	const [matchedTiles, setMatchedTiles] = useState<
		SelectedItems[] | []
	>([]);
	const [selectedTiles, setSelectedTiles] = useState<SelectedItems | null>(null);

 const {isInitialViewActive, onStart} = useStartGame(isRunning, startTime)

	const clickCountRef = useRef(0);

	useEffect(() => {
		if (isFinished) {
			alert("Time is finished");
		}
	}, [isFinished]);

	const resetSelection = () => {
		setTimeout(() => {
			setSelectedTiles(null);
		}, 2000);
	};

  const isSelectionCorrect = (firstIcon: string, secondIcon: string) => {
    return firstIcon === secondIcon;
  }

	const onTileClickHandler = (tile: TileItem) => {
		if (GAME_CONFIG.POSSIBLE_ACTIONS <= clickCountRef.current) {
			alert("Allowed clicked is finished");
			return;
		}

		clickCountRef.current += 1;

		setSelectedTiles((prev) => {
			if (!prev?.itemOne) {
				return {
					itemOne: tile,
				};
			}

			const isCorrect = isSelectionCorrect(prev.itemOne.icon, tile.icon);

			const tiles = {
				itemOne: prev.itemOne,
				itemTwo: tile,
			};

			if (isCorrect) {
				setMatchedTiles((prev) => [...prev, tiles]);
			}

			resetSelection();
			clickCountRef.current += 1;

			return tiles;
		});
	};

	/**
	 * @description If the item is selected correctly earlier,
	 * should not be able to be selected
	 */
	const checkPreviousCorrection = (iconPath: string) => {
		return matchedTiles.find(
			(f) => f.itemOne.icon === iconPath || f.itemTwo.icon === iconPath,
		);
	};

	const isItemCorrect = (index: number) => {
		return matchedTiles.filter(
			(f) => f.itemOne.id === index || f.itemTwo.id === index,
		);
	};

	const isTileSelected = (index: number, correctSelectedLenght: number) => {
		return (
			selectedTiles?.itemOne?.id === index ||
			selectedTiles?.itemTwo?.id === index ||
			!!correctSelectedLenght
		);
	};

	/**
	 *
	 * @description This function is used to prevent new
	 * selection there is selection right now
	 */
	const isAnyTileInSelection = () => {
		return selectedTiles?.itemOne && selectedTiles.itemTwo;
	};

	const isGameAllowed = () => {
		return isRunning;
	};

  
	const renderTileItem = (item: TileItem, index: number) => {
    const correctSelectedLenght = isItemCorrect(index).length;
		const isActive = isTileSelected(index, correctSelectedLenght) || isInitialViewActive
		const isDisabled = !!(
      checkPreviousCorrection(item.icon) ||
			isAnyTileInSelection() ||
			!isGameAllowed()
		);

		return (
			<TileCard
				key={index}
				isActive={isActive}
				icon={item.icon}
				isDisabled={isDisabled}
				onClick={() => onTileClickHandler({ ...item, id: index })}
			/>
		);
	};

	const tilesList = tiles.map(renderTileItem);

  const handleStart = () =>{
    onStart();
  }

	return (
		<div className="body">
			<button onClick={handleStart}>شروع</button>
			<br />
			<div className="wrapper">{tilesList}</div>
		</div>
	);
}

export default App;
