const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('Comments endpoints', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      const requestPayload = {
        content: 'content'
      };
      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper.getCredential({ server });

      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {};
      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper.getCredential({ server });

      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = { content: 123 };
      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper.getCredential({ server });

      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and delete comment', async () => {
      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper.getCredential({ server });

      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userId, threadId });

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 403 when user not the owner of the comment', async () => {
      const server = await createServer(container);

      const { userId: firstUserId } = await ServerTestHelper.getCredential({ server, username: 'dicoding' });

      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: firstUserId });

      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, owner: firstUserId, threadId });

      const { accessToken: secondAccessToken } = await ServerTestHelper.getCredential({ server, username: 'anggiirawan' });

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${secondAccessToken}`
        }
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('anda bukan pemilik komentar ini');
    });

    it('should insert comment using default threadId and owner', async () => {
      await CommentsTableTestHelper.cleanTable();

      await UsersTableTestHelper.addUser({ id: 'user-123' });

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      await CommentsTableTestHelper.addComment({});

      const result = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(result).toHaveLength(1);
      expect(result[0].thread_id).toBe('thread-123');
      expect(result[0].owner).toBe('user-123');
      expect(result[0].content).toBe('comment');
    });
  });
});
