require('dotenv').config();
const crypto = require("crypto");
const cryptoJS = require("crypto-js");
const bcrypt = require('bcrypt');
const validator = require('validator');
const { queueRehash } = require('@queue/rehashQueue');
// const { v4: uuidv4 } = require('uuid');

const key = process.env.ENC_KEY;
const iv = process.env.ENC_IV;
// const method = process.env.ENC_METHOD; // Encryption method
const cost = process.env.HASH_COST;
const enc_array = ['general', 'token', 'receiving_medium'];

// Hash password asynchronously
const hashPassword = async (password) => await bcrypt.hash(password, 10);

// Verify password asynchronously
const verifyPassword = async (plainPassword, hashedPassword, userId = null) => {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    if (!match) return false;

    const currentRounds = parseInt(hashedPassword.split('$')[2], 10);
    const needsRehash = currentRounds !== cost;

    if (needsRehash && userId) {
            // pass to queue job
            queueRehash({userId, plainPassword });
    }

    return true;
};

// Encrypt only if type exists in enc_array
const selEncrypt = (data, type = 'general') => enc_array.includes(type) ? encrypt(data) : data;

// Decrypt only if type exists in enc_array
const selDecrypt = (data, type = 'general') => enc_array.includes(type) ? decrypt(data) : data;

const encrypt = (data) => cryptoJS.AES.encrypt(
    data,
    cryptoJS.enc.Utf8.parse(key),
    { iv: cryptoJS.enc.Utf8.parse(iv) }
).toString();

const decrypt = (data) => cryptoJS.AES.decrypt(
    data,
    cryptoJS.enc.Utf8.parse(key),
    { iv: cryptoJS.enc.Utf8.parse(iv) }
).toString(cryptoJS.enc.Utf8);

const validateInput = (data, type) => {
    switch (type) {
        case 'email': return validator.isEmail(data);
        case 'name': return validator.isAlpha(data) && validator.isLength(data, { min: 1, max: 50 });
        case 'username': return validator.isAlphanumeric(data) && validator.isLength(data, { min: 5, max: 10 });
        case 'otp_code': return validator.isNumeric(data) && validator.isLength(data, { min: 6, max: 6 });
        case 'mobile_number': return validator.isNumeric(data) && validator.isLength(data, { min: 11, max: 11 });
        default: return false;
    }
};

const validatePin = (pin) => validator.isNumeric(pin) && validator.isLength(pin, { min: 4, max: 4 }) && pin !== '1234';

const validatePassword = (password) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+_!@#$^&*.,?]).{8,}$/.test(password);

const generateUniqueToken = () => crypto.randomBytes(32).toString('hex');

const generateUniqueId = (max) => crypto.randomInt(2, Number(`1${'0'.repeat(max)}`));

module.exports = {
    hashPassword,
    verifyPassword,
    selEncrypt,
    selDecrypt,
    validateInput,
    validatePin,
    validatePassword,
    generateUniqueToken,
    generateUniqueId
};

// static encrypt1(text){
    //     const cipher = crypto.createCipheriv(method, Buffer.from(key), iv);
    //     let encrypted = cipher.update(text);
    //     encrypted = Buffer.concat([encrypted, cipher.final()]);
    //     return encrypted.toString('hex');
    // }

    // static decrypt1(text){
    //     const encryptedText = Buffer.from(text, 'hex');
    //     const decipher = crypto.createDecipheriv(method, Buffer.from(key), iv);
    //     let decrypted = decipher.update(encryptedText);
    //     decrypted = Buffer.concat([decrypted, decipher.final()]);
    //     return decrypted.toString();
    // }