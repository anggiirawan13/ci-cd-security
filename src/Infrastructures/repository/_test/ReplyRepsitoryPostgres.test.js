const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  it('should be instance of ReplyRepository domain', () => {
    const replyRepositoryPostgres = new ReplyRepositoryPostgres({}, {}, {});
    expect(replyRepositoryPostgres).toBeInstanceOf(ReplyRepositoryPostgres);
  });

  describe('behavior test', () => {
    beforeAll(async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
    });

    afterEach(async () => {
      await RepliesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await pool.end();
    });

    describe('checkReplyIsExist function', () => {
      it('should not throw error when reply found', async () => {
        await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        await expect(replyRepositoryPostgres.checkReplyIsExist({ replyId: 'reply-123', commentId: 'comment-123', threadId: 'thread-123' })).resolves.not.toThrowError(NotFoundError);
      });

      it('should throw NotFoundError when reply not found', async () => {
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        await expect(replyRepositoryPostgres.checkReplyIsExist({ replyId: 'reply-123', commentId: 'comment-123', threadId: 'thread-123' })).rejects.toThrowError(NotFoundError);
      });
    });

    describe('addReply function', () => {
      it('should persist add reply and return added reply correctly', async () => {
        const newReply = {
          content: 'content',
          owner: 'user-123',
          commentId: 'comment-123'
        };

        function fakeIdGenerator() {
          return '123';
        }

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(
          pool,
          fakeIdGenerator
        );

        const addedReply = await replyRepositoryPostgres.addReply(newReply);

        const replies = await RepliesTableTestHelper.findReplyById('reply-123');

        expect(addedReply).toStrictEqual(
          new AddedReply({
            id: 'reply-123',
            content: newReply.content,
            owner: newReply.owner
          })
        );

        expect(replies).toHaveLength(1);
      });
    });

    describe('addReply function with default value', () => {
      it('should insert reply using all default parameters in helper', async () => {
        await UsersTableTestHelper.cleanTable();

        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
        await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });

        await RepliesTableTestHelper.addReply({}); // ✅ ini yang punya default

        const result = await RepliesTableTestHelper.findReplyById('reply-123');
        expect(result).toHaveLength(1);
      });
    });

    describe('deleteReply function', () => {
      it('should persist delete reply', async () => {
        await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        await replyRepositoryPostgres.deleteReply('reply-123');

        const replies = await RepliesTableTestHelper.findReplyById('reply-123');
        expect(replies[0].is_deleted).toEqual(true);
      });

      it('should throw NotFoundError when reply not found', async () => {
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        await expect(replyRepositoryPostgres.deleteReply('reply-123')).rejects.toThrowError(NotFoundError);
      });
    });

    describe('getRepliesByThreadId function', () => {
      it('should return replies correctly', async () => {
        await RepliesTableTestHelper.addReply({
          id: 'reply-123', commentId: 'comment-123', content: 'content', owner: 'user-123', date: '2021-08-08'
        });

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        const replies = await replyRepositoryPostgres.getRepliesByThreadId('thread-123');

        expect(replies).toHaveLength(1);
        expect(replies[0].id).toEqual('reply-123');
        expect(replies[0].commentId).toEqual('comment-123');
        expect(replies[0].content).toEqual('content');
        expect(replies[0].username).toEqual('dicoding');
        expect(replies[0].date).toEqual('2021-08-08');
        expect(replies[0].isDeleted).toEqual(false);
      });

      it('should return reply is deleted', async () => {
        await RepliesTableTestHelper.addReply({
          id: 'reply-123', commentId: 'comment-123', content: 'content', owner: 'user-123', date: '2021-08-08', isDeleted: true
        });

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        const replies = await replyRepositoryPostgres.getRepliesByThreadId('thread-123');

        expect(replies).toHaveLength(1);
        expect(replies[0].id).toEqual('reply-123');
        expect(replies[0].commentId).toEqual('comment-123');
        expect(replies[0].content).toEqual('content');
        expect(replies[0].username).toEqual('dicoding');
        expect(replies[0].date).toEqual('2021-08-08');
        expect(replies[0].isDeleted).toEqual(true);
      });

      it('should return empty array when no replies', async () => {
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        const replies = await replyRepositoryPostgres.getRepliesByThreadId('thread-123');

        expect(replies).toHaveLength(0);
      });
    });

    describe('verifyReplyOwner function', () => {
      it('should not throw error when owner is valid', async () => {
        await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
      });

      it('should throw AuthorizationError when owner is invalid', async () => {
        await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-124')).rejects.toThrowError(AuthorizationError);
      });
    });
  });
});
