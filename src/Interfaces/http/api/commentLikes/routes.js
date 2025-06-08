const routes = (handler) => [
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.toggleLike,
    options: {
      auth: 'ci_cd_security_jwt'
    }
  }
];

module.exports = routes;
