import {Types} from '../actionTypes/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Action for successful logout
export const logoutSuccess = () => async dispatch => {
  try {
    // Remove token and user data from AsyncStorage
    await AsyncStorage.removeItem('token');

    dispatch({
      type: Types.LOGOUT,
    });
  } catch (error) {
    console.log('Error removing data from AsyncStorage:', error);
  }
};
