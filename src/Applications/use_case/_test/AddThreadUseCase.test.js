const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'title',
      body: 'body'
    };

    const owner = 'user-123';

    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'title',
      owner: 'user-123'
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(
      new AddedThread({
        id: 'thread-123',
        title: 'title',
        owner: 'user-123'
      })
    ));

    const addThreadUseCase = new AddThreadUseCase({ threadRepository: mockThreadRepository });

    const addedThread = await addThreadUseCase.execute(useCasePayload, owner);

    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: expectedAddedThread.owner
      })
    );

    expect(addedThread).toStrictEqual(expectedAddedThread);
  });
});
