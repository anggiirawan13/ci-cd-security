const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  it('should be instance of CommentRepository domain', () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {}, {});
    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepositoryPostgres);
  });

  describe('behavior test', () => {
    beforeAll(async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    });

    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await pool.end();
    });

    describe('checkCommentIsExist function', () => {
      it('should not throw error when comment found', async () => {
        await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

        await expect(commentRepositoryPostgres.checkCommentIsExist({ commentId: 'comment-123', threadId: 'thread-123' })).resolves.not.toThrowError(NotFoundError);
      });

      it('should throw NotFoundError when comment not found', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

        await expect(commentRepositoryPostgres.checkCommentIsExist({ commentId: 'comment-123', threadId: 'thread-123' })).rejects.toThrowError(NotFoundError);
      });
    });

    describe('addComment function', () => {
      it('should persist add comment and return added comment correctly', async () => {
        const newComment = new NewComment({
          content: 'content',
          owner: 'user-123',
          threadId: 'thread-123'
        });

        function fakeIdGenerator() {
          return '123';
        }

        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          fakeIdGenerator
        );

        const addedComment = await commentRepositoryPostgres.addComment(newComment);

        const comments = await CommentsTableTestHelper.findCommentById('comment-123');

        expect(addedComment).toStrictEqual(
          new AddedComment({
            id: 'comment-123',
            content: newComment.content,
            owner: newComment.owner
          })
        );

        expect(comments).toHaveLength(1);
      });
    });

    describe('deleteComment function', () => {
      it('should persist delete comment', async () => {
        await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

        await commentRepositoryPostgres.deleteComment('comment-123');

        const comments = await CommentsTableTestHelper.findCommentById('comment-123');

        expect(comments[0].is_deleted).toEqual(true);
      });

      it('should throw NotFoundError when comment not found', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

        await expect(commentRepositoryPostgres.deleteComment('comment-123')).rejects.toThrowError(NotFoundError);
      });
    });

    describe('getCommentsByThreadId function', () => {
      it('should return comments correctly', async () => {
        const newComment = new NewComment({
          content: 'content',
          owner: 'user-123',
          threadId: 'thread-123'
        });

        const detailComment = new DetailComment({
          id: 'comment-123',
          content: 'content',
          date: '2021-08-08',
          username: 'dicoding',
          isDeleted: false,
          replies: []
        });

        await CommentsTableTestHelper.addComment(newComment);
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

        const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

        expect(comments).toHaveLength(1);
        expect(comments).toStrictEqual([detailComment]);
      });

      it('should return when comment is deleted', async () => {
        await CommentsTableTestHelper.addComment({
          id: 'comment-123', threadId: 'thread-123', owner: 'user-123', content: 'content', date: '2021-08-08', isDeleted: true
        });

        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

        const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

        const expectedDetailComment = new DetailComment({
          id: 'comment-123',
          content: 'content',
          username: 'dicoding',
          date: '2021-08-08',
          isDeleted: true,
          replies: []
        });

        expect(comments).toStrictEqual([expectedDetailComment]);
      });

      it('should return empty array when no comments', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

        const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

        expect(comments).toHaveLength(0);
      });
    });

    describe('verifyCommentOwner function', () => {
      it('should not throw error when comment owner is valid', async () => {
        await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

        await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
      });

      it('should throw AuthorizationError when comment owner is invalid', async () => {
        await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

        await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-999')).rejects.toThrowError(AuthorizationError);
      });
    });

    describe('checkCommentExists function', () => {
      it('should not throw error when comment exists', async () => {
        await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
        const commentRepo = new CommentRepositoryPostgres(pool, () => '123', Date);

        await expect(commentRepo.checkCommentExists('comment-123')).resolves.not.toThrow();
      });

      it('should throw NotFoundError when comment does not exist', async () => {
        const commentRepo = new CommentRepositoryPostgres(pool, () => '123', Date);

        await expect(commentRepo.checkCommentExists('non-existent-comment'))
          .rejects
          .toThrowError(NotFoundError);
      });
    });
  });
});
