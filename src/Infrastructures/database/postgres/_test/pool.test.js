describe('Postgres pool initialization', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = { ...originalEnv };
    jest.resetModules();
  });

  it('should create test pool when NODE_ENV is "test"', () => {
    process.env.NODE_ENV = 'test';
    process.env.PGDATABASE = 'ci_cd_security_test';
    process.env.PGUSER = 'postgres';
    process.env.PGPASSWORD = 'postgres';
    process.env.PGHOST = 'localhost';
    process.env.PGPORT = '5432';

    jest.resetModules();
    // eslint-disable-next-line global-require
    const pool = require('../pool');

    expect(pool).toBeDefined();
    expect(typeof pool.query).toBe('function');
  });

  it('should create default pool when NODE_ENV is not "test"', () => {
    process.env.NODE_ENV = 'production';
    process.env.PGDATABASE = 'ci_cd_security';
    process.env.PGUSER = 'postgres';
    process.env.PGPASSWORD = 'postgres';
    process.env.PGHOST = 'localhost';
    process.env.PGPORT = '5432';

    jest.resetModules();
    // eslint-disable-next-line global-require
    const pool = require('../pool');

    expect(pool).toBeDefined();
    expect(typeof pool.query).toBe('function');
  });
});
