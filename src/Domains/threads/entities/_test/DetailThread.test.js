const DetailThread = require('../DetailThread');

describe('DetailThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      title: 'abc'
    };

    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: 'thread-123',
      title: 'abc',
      body: 1234,
      date: '2021-08-08T07:22:13.017Z',
      username: 'user-123',
      comments: []
    };

    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThread entities correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'abc',
      body: 'abc',
      date: '2021-08-08T07:22:13.017Z',
      username: 'user-123',
      comments: []
    };

    const detailThread = new DetailThread(payload);

    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.username).toEqual(payload.username);
    expect(detailThread.comments).toEqual(payload.comments);
  });
});
