const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123'
    };

    const owner = 'user-123';

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.checkCommentIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository
    });

    await deleteCommentUseCase.execute(useCaseParam, owner);

    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(useCaseParam.commentId, owner);
    expect(mockCommentRepository.checkCommentIsExist).toBeCalledWith(useCaseParam);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCaseParam.commentId);
  });
});
