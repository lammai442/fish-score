import { create } from 'zustand';

interface useAuthStore {
	showLoginModal: boolean;
	openLoginModal: () => void;
	closeLoginModal: () => void;
}

export const useAuthStore = create<useAuthStore>((set) => ({
	showLoginModal: false,
	openLoginModal: () => set({ showLoginModal: true }),
	closeLoginModal: () => set({ showLoginModal: false }),
}));
