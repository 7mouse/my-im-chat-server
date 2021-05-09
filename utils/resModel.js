class BaseModel {
  constructor(message, data) {
    if (data) {
      this.data = data;
    }
    if (message) {
      this.message = message;
    }
  }
}

class SuccessModel extends BaseModel {
  constructor(message, data) {
    super(message, data);
  }
}

class ErrorModel extends BaseModel {
  constructor(message, data) {
    super(message, data);
  }
}

module.exports = {
  SuccessModel,
  ErrorModel
}