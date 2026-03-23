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

export const timeAgo = (date: string): string => {
	const now = new Date();
	const past = new Date(date);

	const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

	if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;

	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) return `${diffInHours} h ago`;

	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 7) return `${diffInDays} days ago`;

	// Fallback till vanligt datum
	return past.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
	});
};
