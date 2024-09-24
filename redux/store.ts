import {configureStore} from "@reduxjs/toolkit"
import reducerArray from "./reducer"

export const store = configureStore({
    reducer: reducerArray
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
