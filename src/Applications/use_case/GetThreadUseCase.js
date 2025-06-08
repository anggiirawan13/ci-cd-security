class GetThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    commentLikeRepository
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;

    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const replies = await this._replyRepository.getRepliesByThreadId(threadId);

    thread.comments = await Promise.all(
      comments.map(async ({ isDeleted, ...rest }) => {
        const likeCount = await this._commentLikeRepository.getLikeCountByCommentId(rest.id);
        return {
          ...rest,
          content: isDeleted ? '**komentar telah dihapus**' : rest.content,
          likeCount
        };
      })
    );

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
