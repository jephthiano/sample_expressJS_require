const initialResponse = (type = 'invalid_request') => ({
    status: false,
    message: type === 'invalid_input' ? 'invalid inputs' : 'invalid request',
    message_detail: '',
    response_data: {},
    error_data: {},
});

const log = (cont, data, type) => {
    console.log(cont, type, data);
};

const isEmptyObject = (obj) => Object.keys(obj).length === 0;

const isEmptyArray = (array) => Array.isArray(array) && array.length === 0;

const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

const isKeyInObject = (key, object) => Object.prototype.hasOwnProperty.call(object, key);

const isEmptyString = (variable) => typeof variable === 'string' && variable.trim().length === 0;

const inArray = (value, array) => array.includes(value);

const isValidData = (data) => !(data === undefined || data === null || data === '');

const isNumber = (value) => Number.isFinite(value);

const ucFirst = (data) => data.charAt(0).toUpperCase() + data.slice(1);

const isDateLapsed = (givenDate, duration = 0, checkDate = new Date()) => {
    const milliDuration = 1000 * duration;
    return new Date(givenDate).getTime() + milliDuration < checkDate.getTime();
};

module.exports = {
    initialResponse,
    log,
    isEmptyObject,
    isEmptyArray,
    isObject,
    isKeyInObject,
    isEmptyString,
    inArray,
    isValidData,
    isNumber,
    ucFirst,
    isDateLapsed,
};
