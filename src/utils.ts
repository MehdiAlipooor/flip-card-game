import { type Tile, tiles } from "./constants";

export function generateRandomTiles() {
	const randomTiles = [...shuffle(tiles), ...shuffle(tiles)];

	const appendRandomId = randomTiles.map((item: Tile) => {
		return {
			id: Math.random(),
			icon: item.icon,
		};
	});

	return appendRandomId;
}

function shuffle(array: Tile[]) {
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
