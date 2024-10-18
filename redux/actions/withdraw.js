import { Dispatch } from 'redux';
import {WITHDRAW_TYPES} from '../actionTypes/withdraw';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Updates the user's portrait property and stores it in AsyncStorage. Allow Potrait to be shown on front end
 *
 * @async
 * @function updatePortrait
 * @param {string} data - The new potrait URI.
 * @param {Dispatch} dispatch - Redux dispatch function to update the store.
 * @returns {Promise<void>} - No return value (asynchronous function).
 * @throws Will throw an error if there is an issue saving data to AsyncStorage.
 * 
 * @example
 * dispatch(updatePortrait('https://example.com/new-portrait.jpg'));
 */

export const addWithdrawSecurityStep = data => async dispatch => {
    try {

    console.log(data);
  
      dispatch({
        type: WITHDRAW_TYPES.ADD_WITHDRAW_SECURITY_STEP,
        payload: data,
      });
    } catch (error) {
      console.log('Error saving data to AsyncStorage:', error);
    }
};
export const addWithdrawData = data => async dispatch => {
    try {

    console.log(data);
  
      dispatch({
        type: WITHDRAW_TYPES.ADD_WITHDRAW_DATA,
        payload: data,
      });
    } catch (error) {
      console.log('Error saving data to AsyncStorage:', error);
    }
};

export const clearWithdrawData = data => async dispatch => {
    try {

    // console.log(data);
  
      dispatch({
        type: WITHDRAW_TYPES.CLEAN_WITHDRAW_DATA,
        payload: data,
      });
    } catch (error) {
      console.log('Error saving data to AsyncStorage:', error);
    }
};
export const addBiometricData = data => async dispatch => {
    try {

    console.log(data);
  
      dispatch({
        type: WITHDRAW_TYPES.ADD_BIOMETRIC_DATA,
        payload: data,
      });
    } catch (error) {
      console.log('Error saving data to AsyncStorage:', error);
    }
};
export const addQnAData = data => async dispatch => {
    try {

    console.log(data);
  
      dispatch({
        type: WITHDRAW_TYPES.ADD_QNA_DATA,
        payload: data,
      });
    } catch (error) {
      console.log('Error saving data to AsyncStorage:', error);
    }
};