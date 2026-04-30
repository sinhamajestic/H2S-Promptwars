import { create } from 'zustand';

interface UserState {
  country: string;
  state: string;
  language: string;
  electionType: string;
}

export const useUserContext = create<UserState>(() => ({
  country: 'US',
  state: '',
  language: 'en',
  electionType: 'general',
}));
