class DbError extends Error {
  constructor(args){
    super(args);
    this.name = "DbError"
  }
}

class DuplicateDataError extends DbError {
  constructor(args){
    super(args);
    this.name = "DuplicateDataError"
  }
}

module.exports = {
  DbError,
  DuplicateDataError
}
