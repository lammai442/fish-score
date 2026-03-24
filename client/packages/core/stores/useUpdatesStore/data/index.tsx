import { create } from 'zustand';

type Update = {
	type: 'catch';
	eventId: string;
	entity: any;
	changedBy?: string;
	createdAt: string;
};

type UpdatesStore = {
	updates: Update[];
	addUpdate: (update: Update) => void;
	clearUpdates: () => void;
};

export const useUpdatesStore = create<UpdatesStore>((set) => ({
	updates: [],

	addUpdate: (update) =>
		set((state) => ({
			updates: [update, ...state.updates].slice(0, 50),
		})),

	clearUpdates: () => set({ updates: [] }),
}));
