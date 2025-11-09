import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateRandomTiles } from "../utils";
import type { TileType } from "../constants";
import { useTimer, useStartGame } from "../hooks";
import { GAME_CONFIG, MESSAGES } from "../config";
import { createClickLimitAction } from "../actions/createClickLimitAction";
import { useAlert } from "../context";

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
	restartGame: () => void;

	/**
	 * @description remaining count down time
	 */
	time: number;
}

const TIMER_DELAY = 3000;

export function useGameCore(): UseGameReturn {
	const initialTiles = useMemo(() => generateRandomTiles(), []);

	const [tiles, setTiles] = useState<TileItem[]>(initialTiles);

	const { startTimer, isFinished, restartTimer, isRunning, stopTimer, time } =
		useTimer(GAME_CONFIG.ALLOWABLE_TIME, TIMER_DELAY);

	const { showAlert } = useAlert();

	const {
		isInitialViewActive,
		onStart,
		onRestart: onRestartInitalView,
	} = useStartGame(isRunning, startTimer);

	const [matchedTiles, setMatchedTiles] = useState<MatchedPair[]>([]);
	const [selectedTiles, setSelectedTiles] = useState<SelectedTiles | null>(
		null,
	);

	const clickCountRef = useRef(0);
	const clickLimitAction = useRef(
		createClickLimitAction(GAME_CONFIG.POSSIBLE_ACTIONS),
	);

	const isGameFinished = useMemo(
		() => clickLimitAction.current.isFinished || isFinished,
		[clickLimitAction.current.isFinished, isFinished],
	);

	const restartGame = useCallback(() => {
		setSelectedTiles(null);
		setMatchedTiles([]);

		onRestartInitalView();

		clickLimitAction.current.reset();

		setTiles(generateRandomTiles());

		stopTimer();

		setTimeout(() => {
			restartTimer();
		}, TIMER_DELAY);
	}, []);

	useEffect(() => {
		if (isFinished) {
			stopTimer();

			showAlert({
				message: MESSAGES.END_TIME_ERROR,
				type: "danger",
				onConfirm: () => {
					restartGame();
				},
				title: MESSAGES.START_AGAIN,
			});
		}
	}, [isFinished]);

	/**
	 * @description We should show victory alert
	 */
	useEffect(() => {
		if (matchedTiles.length === 16) {
			stopTimer();

			showAlert({
				message: MESSAGES.YOU_WIN,
				type: "success",
				onConfirm: () => {
					restartGame();
				},
				title: MESSAGES.START_AGAIN,
			});

			stopTimer();
		}
	}, [matchedTiles.length]);

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
			stopTimer();

			showAlert({
				message: MESSAGES.CLICK_LIMIT_ERROR,
				type: "danger",
				onConfirm: restartGame,
				title: MESSAGES.START_AGAIN,
			});

			return true;
		}

		return false;
	};

	const onTileClick = useCallback(
		(tile: TileItem) => {
			if (!isRunning || isOverClickLimit()) return;

			if (selectedTiles?.itemOne?.id === tile.id) return;
			if (isItemMatched(tile.id)) return;

			clickCountRef.current += 1;

			const addCorrectSelection = (selection: SelectedTiles) => {
				if (isSelectionCorrect(selection.itemOne.icon, tile.icon)) {
					setMatchedTiles((prev) => [...prev, selection as MatchedPair]);
				}
				resetSelection();
			};

			setSelectedTiles((prev) => {
				if (!prev?.itemOne) {
					return { itemOne: tile };
				}

				const newSelection = { itemOne: prev.itemOne, itemTwo: tile };
				addCorrectSelection(newSelection);

				return newSelection;
			});

			clickLimitAction.current.use();
		},
		[
			isRunning,
			isSelectionCorrect,
			resetSelection,
			isItemMatched,
			selectedTiles,
			isOverClickLimit,
		],
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
		isRunning,
		isFinished: isGameFinished,
		isInitialViewActive,
		onTileClick,
		isTileActive,
		isTileDisabled,
		handleStart,
		restartGame,

		time,
		clickCount: clickLimitAction.current.remaining,
	};
}
