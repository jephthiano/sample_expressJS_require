const { sendResponse, handleException, triggerError, triggerValidationError, } = require('@core_util/handler.util');

class BaseService {
  static sendResponse           = sendResponse;
  static handleException        = handleException;
  static triggerError           = triggerError;
  static triggerValidationError = triggerValidationError;
}

module.exports = BaseService;
