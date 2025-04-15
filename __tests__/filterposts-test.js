import { filterPosts } from '../app/filterposts-function';
import { isToday } from 'date-fns';

jest.mock('date-fns', () => ({
  isToday: jest.fn(),
}));

describe('filterPosts', () => {
  const mockPosts = [
    {
      id: '1',
      createdAt: { toDate: () => new Date('2025-04-14') },
      description: 'Post from today',
    },
    {
      id: '2',
      createdAt: { toDate: () => new Date('2025-04-13') },
      description: 'Post from yesterday',
    },
  ];

  it('filters posts for "Today"', () => {
    isToday.mockImplementation((date) => {
      return date.getTime() === new Date('2025-04-14').getTime();
    });

    const filtered = filterPosts(mockPosts, 'Today');

    expect(isToday).toHaveBeenCalledTimes(2);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('1');
  });
  /*
  it('returns all posts if filter is not "Today"', () => {
    const filtered = filterPosts(mockPosts, 'All');
    expect(filtered).toHaveLength(2);
    expect(isToday).not.toHaveBeenCalled();
  });
  */
});