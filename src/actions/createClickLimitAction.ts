export function createClickLimitAction(limit: number) {
	let remaining = limit;

	return {
		get remaining() {
			return remaining;
		},

		get isFinished() {
			return remaining === 0;
		},

		use() {
			if (remaining > 0) {
				remaining -= 1;
			}
			return remaining;
		},

		reset() {
			remaining = limit;
		},
	};
}
