import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Update } from '@fishScore/updatesdata';

type UpdateStore = {
	updates: Update[];
	ownerUserId: string | null;
	addUpdate: (userId: string | undefined, update: Update) => void;
	markAllAsRead: () => void;
	clearUpdates: () => void;
	resetForUser: (userId: string | null) => void;
};

export const useUpdateStore = create<UpdateStore>()(
	// Persist lagrar i localstorage
	persist(
		(set, get) => ({
			updates: [],
			ownerUserId: null,

			addUpdate: (userId, update) => {
				const { ownerUserId, updates } = get();

				if (ownerUserId && ownerUserId !== userId) {
					set({
						ownerUserId: userId,
						updates: [update],
					});
					return;
				}

				set({
					ownerUserId: userId,
					updates: [update, ...updates].slice(0, 50),
				});
			},
			markAllAsRead: () =>
				set((state) => ({
					updates: state.updates.map((u) => ({
						...u,
						read: true,
					})),
				})),
			clearUpdates: () => set({ updates: [] }),

			resetForUser: (userId) => {
				const { ownerUserId } = get();

				if (ownerUserId !== userId) {
					set({
						ownerUserId: userId,
						updates: [],
					});
				}
			},
		}),
		{
			name: 'updates-store',
		},
	),
);
