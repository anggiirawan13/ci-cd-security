const DetailComment = require('../DetailComment');

describe('DetailComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      content: 'abc',
      date: '2021-08-08T07:22:13.017Z',
      username: 'dicoding',
      replies: []
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: 123,
      content: 'abc',
      date: '2021-08-08T07:22:13.017Z',
      username: 'dicoding',
      isDeleted: false,
      replies: []
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailComment entities correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'abc',
      date: '2021-08-08T07:22:13.017Z',
      username: 'dicoding',
      isDeleted: false,
      replies: []
    };

    const detailComment = new DetailComment(payload);

    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.content).toEqual(payload.content);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.isDeleted).toEqual(payload.isDeleted);
    expect(detailComment.replies).toEqual(payload.replies);
  });
});
