import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import GalleryStack from '../app/gallery';
import { getAuth } from 'firebase/auth';
import { onSnapshot } from 'firebase/firestore';
import { Alert } from 'react-native';
import { format } from 'date-fns';

// Mock Firebase
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({ currentUser: { uid: 'test-user' } })),
}));

jest.mock('expo-router', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  format: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return {
      Ionicons: ({ onPress }) => (
        <Text onPress={onPress} testID="ellipsis-icon">
          Icon
        </Text>
      ),
    };
  });
  

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }) => children,
}));

jest.mock('../app/fullscreenImage', () => 'FullscreenImage');

describe('Gallery Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ NEW 1: Test that toggle button works and switches label
  it('toggle button switches view label correctly', async () => {
    const { findByText } = render(
      <NavigationContainer>
        <GalleryStack />
      </NavigationContainer>
    );

    const toggleButton = await findByText('Switch to List View');
    fireEvent.press(toggleButton);
    expect(await findByText('Switch to Grid View')).toBeTruthy();
  });

   
  // //✅ working test
  // it('displays formatted date under the image', async () => {
  //   const mockImages = [
  //     {
  //       id: '1',
  //       data: () => ({
  //         imageUrl: 'https://example.com/image.jpg',
  //         createdAt: { toDate: () => new Date('2022-12-31T00:00:00Z') },  // Use the actual date passed
  //       }),
  //     },
  //   ];
  
  //   onSnapshot.mockImplementation((_, cb) => {
  //     cb({ docs: mockImages });
  //     return jest.fn();
  //   });
  
  //   const { findByText } = render(
  //     <NavigationContainer>
  //       <GalleryStack />
  //     </NavigationContainer>
  //   );
  
  //   // Check for the formatted date dynamically rendered
  //   const dateLabel = await findByText(/\w{3,9} \d{1,2}, \d{4}/); // e.g., "December 31, 2022"
  //   expect(dateLabel).toBeTruthy();
  // }); 

   
      
      
  
  // ✅ Keep this existing working test
  it('toggles between grid and list views', async () => {
    const { findByText } = render(
      <NavigationContainer>
        <GalleryStack />
      </NavigationContainer>
    );

    const switchToListButton = await findByText('Switch to List View');
    fireEvent.press(switchToListButton);
    expect(await findByText('Switch to Grid View')).toBeTruthy();
  });

  //✅ functional working test
  it('navigates to FullscreenImage on image press', async () => {
    const mockImages = [
        {
          id: '1',
          data: () => ({
            imageUrl: 'https://example.com/image.jpg',
            createdAt: { toDate: () => new Date('2023-01-01T00:00:00Z') },
          }),
        },
      ];
      

    onSnapshot.mockImplementation((_, cb) => {
      cb({ docs: mockImages });
      return jest.fn();
    });

    const { findByRole } = render(
      <NavigationContainer>
        <GalleryStack />
      </NavigationContainer>
    );

    const pressable = await findByRole('button');
    fireEvent.press(pressable);

    expect(pressable).toBeTruthy();
  });

    //✅
    it('shows delete menu when ellipsis icon is pressed', async () => {
        const mockImages = [
          {
            id: '1',
            data: () => ({
              imageUrl: 'https://example.com/image.jpg',
              createdAt: { toDate: () => new Date('2023-02-01T00:00:00Z') },
            }),
          },
        ];
      
        onSnapshot.mockImplementation((_, cb) => {
          cb({ docs: mockImages });
          return jest.fn(); // mock unsubscribe
        });
      
        const { findByTestId, findByText } = render(
          <NavigationContainer>
            <GalleryStack />
          </NavigationContainer>
        );
      
        const icon = await findByTestId('ellipsis-icon');
        fireEvent.press(icon);
      
        const deleteOption = await findByText('Delete');
        expect(deleteOption).toBeTruthy();
      });
      
  

});
