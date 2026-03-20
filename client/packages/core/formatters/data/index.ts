export const dateFormatter = (date: string): string => {
	const parsedDate = new Date(date);

	const datePart = parsedDate.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});

	const timePart = parsedDate.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});

	const formatted = `${datePart} at ${timePart}`;

	return formatted;
};
export const shortDateFormatter = (date: string): string => {
	const parsedDate = new Date(date);

	const datePart = parsedDate.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});

	return datePart;
};
