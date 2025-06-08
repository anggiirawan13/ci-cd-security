const CommentLikesHandler = require('../handler');
const ToggleLikeCommentUseCase = require('../../../../../Applications/use_case/ToggleLikeCommentUseCase');

describe('CommentLikesHandler', () => {
  it('should call ToggleLikeCommentUseCase correctly and return success', async () => {
    const mockUseCaseInstance = {
      execute: jest.fn().mockResolvedValue()
    };

    const container = {
      getInstance: jest.fn().mockReturnValue(mockUseCaseInstance)
    };

    const handler = new CommentLikesHandler(container);

    const fakeRequest = {
      auth: {
        credentials: {
          id: 'user-123'
        }
      },
      params: {
        threadId: 'thread-123',
        commentId: 'comment-123'
      }
    };

    const response = await handler.toggleLike(fakeRequest);

    expect(container.getInstance).toHaveBeenCalledWith(ToggleLikeCommentUseCase.name);
    expect(mockUseCaseInstance.execute).toHaveBeenCalledWith({
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123'
    });
    expect(response).toEqual({ status: 'success' });
  });
});
