import MockAsyncStorage from 'mock-async-storage';

//mock async storage
const mockImpl = new MockAsyncStorage();
jest.mock('@react-native-async-storage/async-storage', () => mockImpl);


//mock notifications
jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  getPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notification-identifier'),
  setNotificationHandler: jest.fn(),
}));


//mock firebase
jest.mock('firebase/app');
jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('firebase/storage');


//mock navigation
jest.mock('expo-router', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    goBack: jest.fn(),
  }),
}));


//mock expo background task functions
jest.mock('expo-task-manager', () => ({
  defineTask: jest.fn(),
  isTaskDefined: jest.fn().mockReturnValue(false),
  unregisterAllTasksAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('expo-background-fetch', () => ({
  BackgroundFetchStatus: {
    AVAILABLE: 'available',
    DENIED: 'denied',
    RESTRICTED: 'restricted',
  },
  registerTaskAsync: jest.fn().mockResolvedValue(undefined),
  unregisterTaskAsync: jest.fn().mockResolvedValue(undefined),
  getStatusAsync: jest.fn().mockResolvedValue('available'),
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));
jest.mock('@expo/vector-icons',()=>({
  Ionicons:'',
}));
//Mocks
const mockNavigation = {
  replace: jest.fn(),
};

jest.mock('@react-native-async-storage/async-storage',()=>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('firebase/auth',()=>({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock('firebase/firestore',()=>({
  getFirestore: jest.fn(),
  setDoc: jest.fn(),
  getDoc : jest.fn(),
  doc: jest.fn()
}));
jest.mock('date-fns', () => ({
  isToday: jest.fn(),
}));
