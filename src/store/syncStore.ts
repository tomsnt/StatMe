import { create } from 'zustand';

type SyncStore = {
  enabled: boolean;
  userId: string | null;
  userEmail: string | null;
  lastSyncAt: string | null;
  syncing: boolean;
  error: string | null;
  setEnabled: (enabled: boolean) => void;
  setUser: (userId: string | null, userEmail: string | null) => void;
  setSyncing: (syncing: boolean) => void;
  setLastSyncAt: (at: string) => void;
  setError: (error: string | null) => void;
};

export const useSyncStore = create<SyncStore>((set) => ({
  enabled: false,
  userId: null,
  userEmail: null,
  lastSyncAt: null,
  syncing: false,
  error: null,

  setEnabled: (enabled) => set({ enabled }),
  setUser: (userId, userEmail) => set({ userId, userEmail }),
  setSyncing: (syncing) => set({ syncing }),
  setLastSyncAt: (lastSyncAt) => set({ lastSyncAt }),
  setError: (error) => set({ error }),
}));
