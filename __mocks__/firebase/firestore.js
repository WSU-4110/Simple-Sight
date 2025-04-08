export const getFirestore = jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(() => Promise.resolve('Document written')),
        get: jest.fn(() => Promise.resolve({ exists: true, data: () => ({ title: 'Mocked Title' }) })),
      })),
    })),
  }));
  
  export const doc = jest.fn();
  export const setDoc = jest.fn(() => Promise.resolve());
  export const getDoc = jest.fn(() => Promise.resolve({ exists: true, data: () => ({ title: 'Mocked Title' }) }));
  export const collection = jest.fn();
  export const getDocs = jest.fn(() => Promise.resolve({ docs: [{ id: '1', data: () => ({ title: 'Mocked Title' }) }] }));
  