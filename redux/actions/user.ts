import { Dispatch } from 'redux';
import {USER_TYPES} from '../actionTypes/user';
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

export const updatePotrait = (data : string) => async (dispatch:Dispatch): Promise<void> => {

  try {
    //get current user data JSON string
    const storedUser = await AsyncStorage.getItem('user');

    //if not empty process the json and replace potrait
    if (storedUser !== null) {
        const user = JSON.parse(storedUser);

        user.portrait = data;
  
        await AsyncStorage.setItem('user', JSON.stringify(user));
  
        console.log('User portrait updated successfully!');

      } else {
        //if empty create json object
        let user = {
            potrait: data
        }

        await AsyncStorage.setItem('user', JSON.stringify(user));
  
      }

    dispatch({
        type: USER_TYPES.UPDATE_POTRAIT,
        payload: data,
    });
    
  } catch (error) {
    console.error('Error saving data to AsyncStorage:', error);
  }
    
};
