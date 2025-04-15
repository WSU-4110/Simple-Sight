import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Welcome from '../app/welcome';
import { useNavigation } from 'expo-router';

jest.mock('expo-router', () => ({
  useNavigation: jest.fn(),
}));

describe('Welcome component', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    useNavigation.mockReturnValue({ replace: mockReplace });
  });

  it('renders without crashing', () => {
    const { getByText } = render(<Welcome />);
    expect(getByText('Welcome to Simple‑Sight')).toBeTruthy();
  });

  it('renders the subtitle text', () => {
    const { getByText } = render(<Welcome />);
    expect(getByText('Capture and share the beauty around you.')).toBeTruthy();
  });

  it('renders the register/login button', () => {
    const { getByText } = render(<Welcome />);
    expect(getByText('Register / Login')).toBeTruthy();
  });

  it('navigates to signup screen on button press', () => {
    const { getByText } = render(<Welcome />);
    fireEvent.press(getByText('Register / Login'));
    expect(mockReplace).toHaveBeenCalledWith('signup');
  });

  it('has an animated view that exists', () => {
    const { getByText } = render(<Welcome />);
    const button = getByText('Register / Login');
    expect(button).toBeTruthy();
  });

  it('button styling includes correct text color', () => {
    const { getByText } = render(<Welcome />);
    const buttonText = getByText('Register / Login');
    expect(buttonText.props.style.color).toBe('#a6c1ee');
  });
});
