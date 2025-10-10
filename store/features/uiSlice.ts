import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export interface UIState {
    showSidebar: boolean;
    isMobile: boolean;
}

export const initialState: UIState = {
    showSidebar: true,
    isMobile: false,
};

export const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setShowSidebar: (state, action: PayloadAction<boolean>) => {
            state.showSidebar = action.payload;
        },
        toggleSidebar: (state) => {
            state.showSidebar = !state.showSidebar;
        },
        setIsMobile: (state, action: PayloadAction<boolean>) => {
            state.isMobile = action.payload;
        },
    },
});

export const { setShowSidebar, toggleSidebar, setIsMobile } = uiSlice.actions;

export const selectUI = (state: RootState) => state.ui;

export default uiSlice.reducer;
