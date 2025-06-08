const NewReply = require('../NewReply');

describe('NewReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      content: 'abc',
      owner: 'user-123'
    };

    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      commentId: 123,
      content: 'abc',
      owner: 'user-123'
    };

    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewReply entities correctly', () => {
    const payload = {
      commentId: 'comment-123',
      content: 'abc',
      owner: 'user-123'
    };

    const newReply = new NewReply(payload);

    expect(newReply.commentId).toEqual(payload.commentId);
    expect(newReply.content).toEqual(payload.content);
    expect(newReply.owner).toEqual(payload.owner);
  });
});
