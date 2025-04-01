import MockAsyncStorage from 'mock-async-storage';

//mock async storage
const mockImpl = new MockAsyncStorage();
jest.mock('@react-native-async-storage/async-storage', () => mockImpl);

//mock notifications
jest.mock('expo-notifications', () => ({
  addNotificationReceivedListener: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  getPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  scheduleNotificationAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
  getAllScheduledNotificationsAsync: jest.fn(),
}));