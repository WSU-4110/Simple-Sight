
/*import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import Settings from '../app/settings';
import {signOut} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const mockReplace=jest.fn();

jest.mock('firebase/auth',()=>({
    signOut: jest.fn(),
}));
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
  }));

jest.mock('expo-router',()=>({
    //useRouter: jest.fn(),
    useRouter: () => ({
        replace: mockReplace, // ✅ must return an object with the replace method
    }),
}));

describe('Settings Component', () => {
    it('should log out user and navigate to welcome screen', async () => {
      const mockReplace = jest.fn();
      useRouter.mockReturnValue({ replace: mockReplace });
  
      signOut.mockResolvedValue(); // mock successful logout
      AsyncStorage.removeItem.mockResolvedValue();
  
      const { getByText } = render(<Settings />);
      const logoutButton = getByText('Logout');
  
      fireEvent.press(logoutButton);
  
      await waitFor(() => {
        expect(signOut).toHaveBeenCalledTimes(1);
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('username');
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('stayLoggedIn');
        expect(mockReplace).toHaveBeenCalledWith('welcome');
      });
    });
  });
  */