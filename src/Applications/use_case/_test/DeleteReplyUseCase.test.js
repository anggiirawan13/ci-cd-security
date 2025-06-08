const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    const useCaseParam = {
      replyId: 'reply-123'
    };

    const owner = 'user-123';

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.verifyReplyOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.checkReplyIsExist = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository
    });

    await deleteReplyUseCase.execute(useCaseParam, owner);

    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(useCaseParam.replyId, owner);
    expect(mockReplyRepository.checkReplyIsExist).toBeCalledWith(useCaseParam);
    expect(mockReplyRepository.deleteReply).toBeCalledWith(useCaseParam.replyId);
  });
});
