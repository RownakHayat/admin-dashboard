import { create } from 'zustand';

const initialState = {
    activity_category_id: null,
    receiver_id: null,
};

const chatBotStore = create((set) => ({
    ...initialState,
    changeUserId: (activity_category_id:any, receiver_id:any) =>
        set((state:any) => ({ ...state, activity_category_id, receiver_id })),
}));

export const { changeUserId }:any = chatBotStore.getState();

export default chatBotStore;