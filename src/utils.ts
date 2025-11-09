import { type TileType, tiles } from "./constants";

export function generateRandomTiles() {
	const randomTiles = [...shuffle(tiles), ...shuffle(tiles)];

	const appendRandomId = randomTiles.map((item: TileType) => {
		return {
			id: Math.random(),
			icon: item.icon,
		};
	});

	return appendRandomId;
}

/**
 *
 * @description Generate a randow result of input array
 */
function shuffle(array: TileType[]) {
	const initialTiles = array;

	let currentIndex = array.length;

	while (currentIndex != 0) {
		const randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[initialTiles[currentIndex], initialTiles[randomIndex]] = [
			initialTiles[randomIndex],
			initialTiles[currentIndex],
		];
	}

	return initialTiles;
}
