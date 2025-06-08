const pool = require('../../database/postgres/pool');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('CommentLikeRepositoryPostgres', () => {
  const fakeIdGenerator = () => '123'; // for consistent ID

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should correctly like a comment', async () => {
    const repo = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

    await repo.likeComment('comment-123', 'user-123');

    const result = await pool.query('SELECT * FROM comment_likes WHERE comment_id = $1', ['comment-123']);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].id).toEqual('thread-123');
  });

  it('should correctly check if comment is liked by user', async () => {
    const repo = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

    await repo.likeComment('comment-123', 'user-123');

    const isLiked = await repo.isCommentLikedByUser('comment-123', 'user-123');
    expect(isLiked).toBe(true);
  });

  it('should return false if comment is not liked by user', async () => {
    const repo = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

    const isLiked = await repo.isCommentLikedByUser('comment-123', 'user-123');
    expect(isLiked).toBe(false);
  });

  it('should correctly unlike a comment', async () => {
    const repo = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

    await repo.likeComment('comment-123', 'user-123');
    await repo.unlikeComment('comment-123', 'user-123');

    const result = await pool.query('SELECT * FROM comment_likes WHERE comment_id = $1', ['comment-123']);
    expect(result.rows).toHaveLength(0);
  });

  it('should get correct like count by comment id', async () => {
    const repo = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

    await repo.likeComment('comment-123', 'user-123');

    const count = await repo.getLikeCountByCommentId('comment-123');
    expect(count).toEqual(1);
  });
});
