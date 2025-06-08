const ToggleLikeCommentUseCase = require('../../../../Applications/use_case/ToggleLikeCommentUseCase');

class CommentLikesHandler {
  constructor(container) {
    this._container = container;

    this.toggleLike = this.toggleLike.bind(this);
  }

  async toggleLike(request) {
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const toggleLikeCommentUseCase = this._container.getInstance(ToggleLikeCommentUseCase.name);
    await toggleLikeCommentUseCase.execute({ threadId, commentId, userId });

    return {
      status: 'success'
    };
  }
}

module.exports = CommentLikesHandler;
