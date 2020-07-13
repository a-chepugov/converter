export const generate = (length = 32) =>
	Array
		.from(
			new Array(length),
			() => Math.floor(Math.random() * 36).toString(36)
		)
		.join('')
