import { create } from 'zustand';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

interface useAuthStore {
	showLoginModal: boolean;
	authStatus: AuthStatus;
	openLoginModal: () => void;
	closeLoginModal: () => void;
	setAuthStatus: (status: AuthStatus) => void;
}

export const useAuthStore = create<useAuthStore>((set) => ({
	showLoginModal: false,
	authStatus: 'checking',
	openLoginModal: () => set({ showLoginModal: true }),
	closeLoginModal: () => set({ showLoginModal: false }),
	setAuthStatus: (authStatus) => set({ authStatus }),
}));
