const CommentLikeRepository = require('../CommentLikeRepository');

describe('CommentLikeRepository interface', () => {
  it('should throw error when invoking unimplemented isCommentLikedByUser method', async () => {
    const repo = new CommentLikeRepository();
    await expect(repo.isCommentLikedByUser()).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoking unimplemented likeComment method', async () => {
    const repo = new CommentLikeRepository();
    await expect(repo.likeComment()).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoking unimplemented unlikeComment method', async () => {
    const repo = new CommentLikeRepository();
    await expect(repo.unlikeComment()).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoking unimplemented getLikeCountByCommentId method', async () => {
    const repo = new CommentLikeRepository();
    await expect(repo.getLikeCountByCommentId()).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
