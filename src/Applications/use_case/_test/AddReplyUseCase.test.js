const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    const useCasePayload = {
      content: 'content'
    };

    const useCaseParam = {
      commentId: 'comment-123'
    };

    const owner = 'user-123';

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'content',
      owner: 'user-123'
    });

    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockCommentRepository.checkCommentIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.addReply = jest.fn().mockImplementation(() => Promise.resolve(
      new AddedReply({
        id: 'reply-123',
        content: 'content',
        owner: 'user-123'
      })
    ));

    const addReplyUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
    });

    const addedReply = await addReplyUseCase.execute(useCasePayload, useCaseParam, owner);

    expect(mockReplyRepository.addReply).toBeCalledWith(
      new NewReply({
        content: 'content',
        owner: 'user-123',
        commentId: 'comment-123'
      })
    );

    expect(mockCommentRepository.checkCommentIsExist).toBeCalledWith(useCaseParam);
    expect(addedReply).toStrictEqual(expectedAddedReply);
  });
});
