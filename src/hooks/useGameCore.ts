import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateRandomTiles } from "../utils";
import type { TileType } from "../constants";
import { useTimer, useStartGame } from "../hooks";
import { GAME_CONFIG } from "../config";
import { createClickLimitAction } from "../actions/createClickLimitAction";

type TileItem = TileType & { id: number };
type SelectedTiles = { itemOne: TileItem; itemTwo?: TileItem };
type MatchedPair = { itemOne: TileItem; itemTwo: TileItem };

export interface UseGameReturn {
	tiles: TileItem[];
	matchedTiles: MatchedPair[];
	selectedTiles: SelectedTiles | null;
	clickCount: number;
	isRunning: boolean;
	isFinished: boolean;
	isInitialViewActive: boolean;
	onTileClick: (tile: TileItem) => void;
	isTileActive: (index: number) => boolean;
	isTileDisabled: (icon: string) => boolean;
	handleStart: () => void;
}

export function useGameCore(): UseGameReturn {
	const tiles = useMemo(() => generateRandomTiles(), []);

	const { startTimer, isFinished, isRunning } = useTimer(
		GAME_CONFIG.ALLOWABLE_TIME,
	);

	const { isInitialViewActive, onStart } = useStartGame(isRunning, startTimer);

	const [matchedTiles, setMatchedTiles] = useState<MatchedPair[]>([]);
	const [selectedTiles, setSelectedTiles] = useState<SelectedTiles | null>(
		null,
	);
	const clickCountRef = useRef(0);
	const clickLimitAction = useRef(
		createClickLimitAction(GAME_CONFIG.POSSIBLE_ACTIONS),
	);

	useEffect(() => {
		if (isFinished) {
			alert("Time is finished!");
		}
	}, [isFinished]);

	const isSelectionCorrect = useCallback(
		(firstIcon: string, secondIcon: string) => firstIcon === secondIcon,
		[],
	);

	const resetSelection = useCallback(() => {
		setTimeout(() => setSelectedTiles(null), 1000);
	}, []);

	const checkPreviousMatch = useCallback(
		(iconPath: string) =>
			matchedTiles.some(
				(item) =>
					item.itemOne.icon === iconPath || item.itemTwo.icon === iconPath,
			),
		[matchedTiles],
	);

	const isItemMatched = useCallback(
		(id: number) =>
			matchedTiles.some(
				(item) => item.itemOne.id === id || item.itemTwo.id === id,
			),
		[matchedTiles],
	);

	const isAnyTileInSelection = useCallback(
		() => !!(selectedTiles?.itemOne && selectedTiles?.itemTwo),
		[selectedTiles],
	);

	const isOverClickLimit = () => {
		if (clickLimitAction.current.isFinished) {
			alert("Allowed clicks finished");
			return true;
		}

		return false;
	};

	const onTileClick = useCallback(
		(tile: TileItem) => {
			if (!isRunning || isOverClickLimit()) return;

			clickCountRef.current += 1;

			const addCorrectSelection = (selection: SelectedTiles) => {
				if (isSelectionCorrect(selection.itemOne.icon, tile.icon)) {
					setMatchedTiles((prev) => [...prev, selection as MatchedPair]);
				}
				resetSelection();
			};

			setSelectedTiles((prev) => {
				/**
				 * @description This is first selection
				 */
				if (!prev?.itemOne) {
					return { itemOne: tile };
				}

				const newSelection = { itemOne: prev.itemOne, itemTwo: tile };
				addCorrectSelection(newSelection);

				return newSelection;
			});

			clickLimitAction.current.use();
		},
		[isRunning, isSelectionCorrect, resetSelection],
	);

	const isTileActive = useCallback(
		(index: number) => {
			const isSelected =
				selectedTiles?.itemOne?.id === index ||
				selectedTiles?.itemTwo?.id === index;
			return isSelected || isItemMatched(index) || isInitialViewActive;
		},
		[selectedTiles, isItemMatched, isInitialViewActive],
	);

	const isTileDisabled = useCallback(
		(icon: string) =>
			checkPreviousMatch(icon) || isAnyTileInSelection() || !isRunning,
		[checkPreviousMatch, isAnyTileInSelection, isRunning],
	);

	const handleStart = useCallback(() => {
		onStart();
	}, [onStart]);

	return {
		tiles,
		matchedTiles,
		selectedTiles,
		clickCount: clickCountRef.current,
		isRunning,
		isFinished,
		isInitialViewActive,
		onTileClick,
		isTileActive,
		isTileDisabled,
		handleStart,
	};
}
