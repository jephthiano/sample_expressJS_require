const { triggerError} = require('#core_util/handler.util');

const getEnvorThrow = (key) => {
    const val = process.env[key];
    if (!val) triggerError("Error occurred on the server", [], 500);
    
    return val;
}

const isEmptyObject = (obj) => Object.keys(obj).length === 0;

const isEmptyArray = (array) => Array.isArray(array) && array.length === 0;

const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

const isKeyInObject = (key, object) => Object.prototype.hasOwnProperty.call(object, key);

const isValidString = (variable) => typeof variable === 'string' && variable.trim().length > 0;

const isEmptyString = (variable) => typeof variable === 'string' && variable.trim().length === 0;

const inArray = (value, array) => array.includes(value);

const isValidData = (data) => !(data === undefined || data === null || data === '');
  
const replaceValues = (data, value, replace) => {
    const regex = new RegExp(value, 'g');
    return data.replace(regex, replace);
};
  

const isNumber = (value) => !isNaN(value) && typeof Number(value) === "number" && Number.isFinite(value);

const ucFirst = (data) => data.charAt(0).toUpperCase() + data.slice(1);

const isDateLapsed = (givenDate, duration = 0, checkDate = new Date()) => {
    const milliDuration = 1000 * duration;
    return new Date(givenDate).getTime() + milliDuration < checkDate.getTime();
};

const parseMessageToObject = (errorDetails) => {
    const errors = errorDetails.reduce((acc, err) => {
        acc[err.path[0]] = err.message; // Assign each field's error message
        return acc;
    }, {});
    
    return errors; // Return the structured errors as an object
};

module.exports = {
    getEnvorThrow,
    isEmptyObject,
    isEmptyArray,
    isObject,
    isKeyInObject,
    isValidString,
    isEmptyString,
    inArray,
    isValidData,
    replaceValues,
    isNumber,
    ucFirst,
    isDateLapsed,
    parseMessageToObject,
};
