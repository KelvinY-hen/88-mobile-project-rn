
import { Dispatch } from 'redux';
import {MASTER_DATA} from '../actionTypes/masterData';
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

export const addQuestions = data => async dispatch => {
    try {

    console.log('ini',data);
  
      dispatch({
        type: MASTER_DATA.ADD_QUESTIONS,
        payload: data,
      });
    } catch (error) {
      console.log('Error saving data to AsyncStorage:', error);
    }
};
export const clearQuestions = data => async dispatch => {
    try {

    console.log(data);
  
      dispatch({
        type: MASTER_DATA.CLEAR_QUESTIONS,
        payload: data,
      });
    } catch (error) {
      console.log('Error saving data to AsyncStorage:', error);
    }
};