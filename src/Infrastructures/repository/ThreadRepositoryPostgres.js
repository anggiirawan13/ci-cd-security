const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads (id, title, body, owner) VALUES($1, $2, $3, $4) '
        + 'RETURNING id, title, owner',
      values: [id, title, body, owner]
    };

    const result = await this._pool.query(query);
    return new AddedThread(result.rows[0]);
  }

  async getThreadById(threadId) {
    const query = {
      text: `SELECT threads.id, 
                    threads.title, 
                    threads.body, 
                    threads.date, 
                    users.username
             FROM threads
             LEFT JOIN users ON threads.owner = users.id
             WHERE threads.id = $1`,
      values: [threadId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) { throw new NotFoundError('thread tidak ditemukan'); }

    return new DetailThread({ ...result.rows[0], comments: [] });
  }

  async verifyThreadAvailability(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) { throw new NotFoundError('thread tidak ditemukan'); }
  }

  async checkThreadExists(commentId) {
    const result = await this._pool.query({
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [commentId]
    });

    if (result.rowCount === 0) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
