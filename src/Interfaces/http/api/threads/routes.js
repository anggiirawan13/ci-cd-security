const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: (request, h) => handler.postThreadHandler(request, h),
    options: {
      auth: 'ci_cd_security_jwt'
    }
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: (request, h) => handler.getThreadByIdHandler(request, h)
  }
];

module.exports = routes;
