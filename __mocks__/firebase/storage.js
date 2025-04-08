export const getStorage = jest.fn(() => ({
    ref: jest.fn(() => ({
      getDownloadURL: jest.fn(() => Promise.resolve('https://mocked-url.com/image.jpg')),
    })),
  }));
  
  export const ref = jest.fn();
  export const uploadBytes = jest.fn(() => Promise.resolve({ ref: { fullPath: 'mocked/path' } }));
  export const getDownloadURL = jest.fn(() => Promise.resolve('https://mocked-url.com/image.jpg'));
  