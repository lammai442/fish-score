export interface LoginData {
	email: string;
	password: string;
}

export interface RegisterData extends LoginData {
	firstName: string;
	lastName: string;
}
