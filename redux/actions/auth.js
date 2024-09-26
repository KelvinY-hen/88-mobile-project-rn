import {Types} from '../actionTypes/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_TYPES } from '../actionTypes/user';

// export const loginSuccess = data => ({
//     type: Types.LOGIN_SUCCESS,
//     payload: data,
//   });
  
// export  const toggleIsLoggedIn = value => ({
//     type: Types.TOGGLE_LOGIN,
//     payload: value,
//   });

// export  const logoutSuccess = value => ({
//     type: Types.LOGOUT
//   });


export const loginSuccess = data => async dispatch => {
  try {
    // Save token to AsyncStorage
    await AsyncStorage.setItem('token', data.token);

    dispatch({
      type: Types.LOGIN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log('Error saving data to AsyncStorage:', error);
  }
};

// Action to toggle login status
export const toggleIsLoggedIn = value => async dispatch => {
  try {
    // Save login state to AsyncStorage
    await AsyncStorage.setItem('token', data.token);

    dispatch({
      type: Types.TOGGLE_LOGIN,
      payload: value,
    });
  } catch (error) {
    console.log('Error saving login state:', error);
  }
};


export const getUserData = data => async dispatch => {
  try {
    dispatch({
      type: USER_TYPES.UPDATE_USER_DATA,
      payload: data,
    });
  } catch (error) {
    console.log('Error saving data to AsyncStorage:', error);
  }
};


// Action for successful logout
export const logoutSuccess = () => async dispatch => {
  try {
    
    // Remove token and user data from AsyncStorage
    await AsyncStorage.removeItem('token');

    // Dispatch LOGOUT action to clear token and authentication state
    dispatch({
      type: Types.LOGOUT,
    });

    // Dispatch LOGOUT_USER_DATA action to clear user data
    dispatch({
      type: USER_TYPES.LOGOUT_USER_DATA,
    });

  } catch (error) {
    console.log('Error removing data from AsyncStorage:', error);
  }
};
