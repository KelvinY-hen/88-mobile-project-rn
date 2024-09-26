// store/types.ts
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from './rootReducer'; // Assuming you have a root reducer

export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
