import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { persistentKeys } from '../constants/persistenceKeys';

beforeEach(() => {
    AsyncStorage.clear();
    // console.log(`After the data is being reset :`)
    // console.log(AsyncStorage)
});

afterEach(() => {
    jest.clearAllTimers();
});

it('can read asyncstorage', async () => {

    await AsyncStorage.setItem('username', 'testUser')
    let usernameValue = await AsyncStorage.getItem('username')
    // console.log(`After the data is being set :`)
    // console.log(AsyncStorage)
    expect(usernameValue).toBe('testUser')
});

it('can retrieve start time and convert to date', async () => {

    var startTime = await AsyncStorage.getItem(persistentKeys.startTimeKey);
    startTime = new Date(startTime);
    // console.log(`After the data is being set :`)
    // console.log(AsyncStorage)
    expect(startTime).toBeInstanceOf(Date);
});