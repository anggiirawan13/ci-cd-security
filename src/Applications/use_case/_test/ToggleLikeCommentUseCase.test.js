const ToggleLikeCommentUseCase = require('../ToggleLikeCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentLikeRepository = require('../../../Domains/commentLikes/CommentLikeRepository');

describe('ToggleLikeCommentUseCase', () => {
  const useCasePayload = {
    threadId: 'thread-123',
    commentId: 'comment-123',
    userId: 'user-123'
  };

  let mockThreadRepository;
  let mockCommentRepository;
  let mockCommentLikeRepository;

  beforeEach(() => {
    mockThreadRepository = new ThreadRepository();
    mockCommentRepository = new CommentRepository();
    mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.checkThreadExists = jest.fn();
    mockCommentRepository.checkCommentExists = jest.fn();
    mockCommentLikeRepository.isCommentLikedByUser = jest.fn();
    mockCommentLikeRepository.likeComment = jest.fn();
    mockCommentLikeRepository.unlikeComment = jest.fn();
  });

  it('should like comment if user has not liked it', async () => {
    mockThreadRepository.checkThreadExists.mockResolvedValue();
    mockCommentRepository.checkCommentExists.mockResolvedValue();
    mockCommentLikeRepository.isCommentLikedByUser.mockResolvedValue(false);

    const useCase = new ToggleLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository
    });

    await useCase.execute(useCasePayload);

    expect(mockThreadRepository.checkThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkCommentExists).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentLikeRepository.isCommentLikedByUser).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.userId
    );
    expect(mockCommentLikeRepository.likeComment).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.userId
    );
    expect(mockCommentLikeRepository.unlikeComment).not.toHaveBeenCalled();
  });

  it('should unlike comment if user already liked it', async () => {
    mockThreadRepository.checkThreadExists.mockResolvedValue();
    mockCommentRepository.checkCommentExists.mockResolvedValue();
    mockCommentLikeRepository.isCommentLikedByUser.mockResolvedValue(true);

    const useCase = new ToggleLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository
    });

    await useCase.execute(useCasePayload);

    expect(mockThreadRepository.checkThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkCommentExists).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentLikeRepository.isCommentLikedByUser).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.userId
    );
    expect(mockCommentLikeRepository.unlikeComment).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.userId
    );
    expect(mockCommentLikeRepository.likeComment).not.toHaveBeenCalled();
  });
});
