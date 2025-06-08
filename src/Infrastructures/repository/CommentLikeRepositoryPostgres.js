const CommentLikeRepository = require('../../Domains/commentLikes/CommentLikeRepository');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async isCommentLikedByUser(commentId, userId) {
    const result = await this._pool.query({
      text: 'SELECT 1 FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId]
    });
    return result.rowCount > 0;
  }

  async likeComment(commentId, userId) {
    const id = `thread-${this._idGenerator()}`;
    await this._pool.query({
      text: 'INSERT INTO comment_likes (id, comment_id, user_id) VALUES ($1, $2, $3)',
      values: [id, commentId, userId]
    });
  }

  async unlikeComment(commentId, userId) {
    await this._pool.query({
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId]
    });
  }

  async getLikeCountByCommentId(commentId) {
    const result = await this._pool.query({
      text: 'SELECT COUNT(*) FROM comment_likes WHERE comment_id = $1',
      values: [commentId]
    });
    return Number(result.rows[0].count);
  }
}

module.exports = CommentLikeRepositoryPostgres;
