export const validateInput = (
	inputValue: string,
	setErrorInput: React.Dispatch<React.SetStateAction<string>>,
	currentEventName: string,
): boolean => {
	const emojiRegex = /[\p{Extended_Pictographic}]/u;
	const value = inputValue.trim();

	if (value.length === 0) {
		setErrorInput('You need to fill in an event name');
		return false;
	}
	if (value === currentEventName) {
		setErrorInput('New event name is the same as current event name');
		return false;
	}

	if (value.length > 18) {
		setErrorInput('Max 18 characters');
		return false;
	}

	if (emojiRegex.test(value)) {
		setErrorInput('Emojis are not allowed');
		return false;
	}

	setErrorInput('');
	return true;
};
