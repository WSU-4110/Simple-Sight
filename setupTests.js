import MockAsyncStorage from 'mock-async-storage';

// Mock AsyncStorage
const mockImpl = new MockAsyncStorage();
jest.mock('@react-native-async-storage/async-storage', () => mockImpl);

// Mock notifications
jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  getPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notification-identifier'),
  setNotificationHandler: jest.fn(),
}));

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  initializeAuth: jest.fn(),
  getReactNativePersistence: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue({
      doc: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
          data: jest.fn().mockReturnValue({ id: '1', text: 'mock data' }),
        }),
      }),
    }),
  }),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
}));

// Mock navigation
jest.mock('expo-router', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    goBack: jest.fn(),
  }),
}));

// Mock expo background task functions
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



/*
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

*/