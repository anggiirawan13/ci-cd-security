class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const replies = await this._replyRepository.getRepliesByThreadId(threadId);

    thread.comments = comments.map(({ isDeleted, ...rest }) => (isDeleted ? { ...rest, content: '**komentar telah dihapus**' } : rest));

    for (let i = 0; i < thread.comments.length; i += 1) {
      thread.comments[i].replies = replies
        .filter((reply) => reply.commentId === thread.comments[i].id)
        .map((reply) => {
          const { isDeleted, ...rest } = reply;
          return isDeleted ? { ...rest, content: '**balasan telah dihapus**' } : rest;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return thread;
  }
}

module.exports = GetThreadUseCase;
