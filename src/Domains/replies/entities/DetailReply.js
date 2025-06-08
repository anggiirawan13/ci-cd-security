class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id,
      commentId,
      username,
      date,
      content,
      isDeleted
    } = payload;

    this.id = id;
    this.commentId = commentId;
    this.username = username;

    this.date = date;
    this.content = content;
    this.isDeleted = isDeleted;
  }

  _verifyPayload(payload) {
    if (this._isPayloadNotContainNeededProperty(payload)) { throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'); }

    if (this._isPayloadNotMeetDataTypeSpecification(payload)) { throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'); }
  }

  _isPayloadNotContainNeededProperty({
    id, commentId, username, date, content, isDeleted
  }) {
    return !id || !commentId || !username || !date || !content || isDeleted === undefined;
  }

  _isPayloadNotMeetDataTypeSpecification({
    id, commentId, username, date, content, isDeleted
  }) {
    return typeof id !== 'string' || typeof commentId !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string' || typeof isDeleted !== 'boolean';
  }
}
module.exports = DetailReply;
