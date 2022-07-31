class ApiError extends Error {
  constructor(args){
    super(args);
    this.name = this.constructor.name;
    this.message = args;
    //this.stack = new Error.stack;
  }
}

module.exports = ApiError;
