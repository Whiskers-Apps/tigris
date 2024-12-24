import CssFilterConverter from 'css-filter-converter';

export function getCssFilter(hex: string): string {
	let loss = 0;
	let attempts = 0;
	let filter = '';

	do {
		let result = CssFilterConverter.hexToFilter(hex);
		loss = result.loss ?? 0;
		filter = result.color ?? '';

		attempts += 1;

		if (attempts === 200) {
			break;
		}
	} while (loss > 0.1);

	return filter;
}