const LikeAction = require('../LikeAction');

describe('LikeAction entity', () => {
  it('should create LikeAction entity correctly', () => {
    const payload = {
      commentId: 'comment-123',
      userId: 'user-456'
    };

    const likeAction = new LikeAction(payload);

    expect(likeAction.commentId).toEqual(payload.commentId);
    expect(likeAction.userId).toEqual(payload.userId);
  });

  it('should throw error when payload does not contain required properties', () => {
    expect(() => new LikeAction({})).toThrowError('LIKE_ACTION.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new LikeAction({ commentId: 'comment-123' })).toThrowError('LIKE_ACTION.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new LikeAction({ userId: 'user-456' })).toThrowError('LIKE_ACTION.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payload = {
      commentId: 123,
      userId: true
    };

    expect(() => new LikeAction(payload)).toThrowError('LIKE_ACTION.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
