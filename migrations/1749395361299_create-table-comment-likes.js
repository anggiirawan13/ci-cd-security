exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'comments(id)',
      onDelete: 'CASCADE'
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE'
    },
    created_at: {
      type: 'TIMESTAMP',
      default: pgm.func('current_timestamp')
    }
  });

  pgm.addConstraint('comment_likes', 'unique_comment_user_like', {
    unique: ['comment_id', 'user_id']
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comment_likes');
};
