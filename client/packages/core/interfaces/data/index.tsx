export interface LoginData {
	email: string;
	password: string;
}

export interface RegisterData extends LoginData {
	firstName: string;
	lastName: string;
}

export interface User {
	userId: string;
	email: string;
	firstName: string;
	lastName: string;
	maxCatchWeight: number;
	totalCatchWeight: number;
	createdAt: string;
}
