import axios from 'axios';
import {
  LOGIN_API,
  SIGNUP_API,
  FORGOT_PASSWORD_API,
} from "../utils/constants";

import { API_URL } from '@/config';
import { LoginUserInput } from '@/types';


export const loginUser = async (userData: { username: string; password: string }) => {
  try {
    // Constructing the required fields for the login request
    const loginData = new URLSearchParams();
    loginData.append('grant_type', 'password');
    loginData.append('username', userData.username);
    loginData.append('password', userData.password);
    loginData.append('scope', ''); // Add any required scope or leave empty
    loginData.append('client_id', 'string'); // Replace with your actual client_id if needed
    loginData.append('client_secret', 'string'); // Replace with your actual client_secret if needed

    // Making the POST request with form-urlencoded data
    const response = await axios.post(`${API_URL}${LOGIN_API}`, loginData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log("Response from login API:", response);
    return response.data;
  } catch (error: any) {
    console.error('Error logging in:', error);
    console.log("Error details:", error.response.data);
    throw error.response ? error.response.data : error; // Handle error response
  }
};


// Function to sign up a new user
export const signupUser = async (userData: LoginUserInput) => {
  try {
    const response = await axios.post(`${API_URL}${SIGNUP_API}`, userData);
    return response.data;
  } catch (error: any) {
    console.error('Error signing up:', error);
    console.log("error is ",error.response.data);
    throw error.response ? error.response.data : error; // Handle error response
  }
};

// Function to handle forgot password
export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}${FORGOT_PASSWORD_API}`, { email });
    return response.data;
  } catch (error: any) {
    console.error('Error with forgot password:', error);
    throw error.response ? error.response.data : error; // Handle error response
  }
};
