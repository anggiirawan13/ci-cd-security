const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      content: 'content'
    };

    const useCaseParam = {
      threadId: 'thread-123'
    };

    const owner = 'user-123';

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'content',
      owner: 'user-123'
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(
      new AddedComment({
        id: 'comment-123',
        content: 'content',
        owner: 'user-123'
      })
    ));

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    });

    const addedComment = await addCommentUseCase.execute(useCasePayload, useCaseParam, owner);

    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment({
        content: 'content',
        owner: 'user-123',
        threadId: 'thread-123'
      })
    );

    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCaseParam.threadId);
    expect(addedComment).toStrictEqual(expectedAddedComment);
  });
});
