import { forwardRef, useCallback, useImperativeHandle } from "react";
import type { TileType } from "../../constants";
import { TileCard } from "../TileCard";
import { useGameCore } from "../../hooks/useGameCore";
import './styles.css'

type TileItem = TileType & { id: number };

export type FlipCardRef = {
	start: () => void;
};

export const FlipCard = forwardRef<FlipCardRef>((_, ref) => {
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
		matchedTiles,
	} = useGameCore();

	useImperativeHandle(ref, () => ({
		start: () => {
            console.log('Started')
			handleStart();
		},
	}));

	const renderTileItem = useCallback(
		(tile: TileItem, index: number) => {
			return (
				<TileCard
					key={index}
					icon={tile.icon}
					isActive={isTileActive(index)}
					isDisabled={isTileDisabled(tile.icon) || isInitialViewActive}
					onClick={() => onTileClick({ ...tile, id: index })}
				/>
			);
		},
		[
			isInitialViewActive,
			selectedTiles,
			matchedTiles,
			isFinished,
			isTileActive,
			isTileDisabled,
			onTileClick,
		],
	);

	const tilesList = tiles.map(renderTileItem);

	return (
		<>
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
			<div className="wrapper-grid">{tilesList}</div>
		</>
	);
});

// optional display name for debugging
FlipCard.displayName = "FlipCard";
