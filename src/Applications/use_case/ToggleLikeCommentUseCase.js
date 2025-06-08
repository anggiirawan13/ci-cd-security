class ToggleLikeCommentUseCase {
  constructor({ threadRepository, commentRepository, commentLikeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute({ threadId, commentId, userId }) {
    await this._threadRepository.checkThreadExists(threadId);

    await this._commentRepository.checkCommentExists(commentId);

    const isLiked = await this._commentLikeRepository.isCommentLikedByUser(commentId, userId);

    if (isLiked) {
      await this._commentLikeRepository.unlikeComment(commentId, userId);
    } else {
      await this._commentLikeRepository.likeComment(commentId, userId);
    }
  }
}

module.exports = ToggleLikeCommentUseCase;
