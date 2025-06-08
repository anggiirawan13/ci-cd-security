class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id,
      content,
      date,
      username,
      isDeleted,
      replies
    } = payload;

    this.id = id;
    this.content = content;
    this.date = date;

    this.username = username;
    this.isDeleted = isDeleted;
    this.replies = replies;
  }

  _verifyPayload(payload) {
    if (this._isPayloadNotContainNeededProperty(payload)) throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');

    if (this._isPayloadNotMeetDataTypeSpecification(payload)) throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }

  _isPayloadNotContainNeededProperty({
    id, content, date, username, isDeleted, replies
  }) {
    return !id || !content || !date || !username || isDeleted === undefined || !replies;
  }

  _isPayloadNotMeetDataTypeSpecification({
    id, content, date, username, isDeleted, replies
  }) {
    return typeof id !== 'string' || typeof content !== 'string' || typeof date !== 'string' || typeof username !== 'string' || typeof isDeleted !== 'boolean' || !Array.isArray(replies);
  }
}

module.exports = DetailComment;
