export const getAuth = jest.fn(() => ({
    currentUser: { uid: 'mock-user-id', email: 'test@example.com' },
  }));
  
  export const createUserWithEmailAndPassword = jest.fn(() =>
    Promise.resolve({ user: { uid: 'mock-user-id', email: 'test@example.com' } })
  );
  
  export const signInWithEmailAndPassword = jest.fn(() =>
    Promise.resolve({ user: { uid: 'mock-user-id', email: 'test@example.com' } })
  );
  