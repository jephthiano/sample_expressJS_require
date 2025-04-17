// Declaring Global variables

const path = require('path');

module.exports = function () {
    global.__basedir = __dirname.replace('/config', ''); // Adjust based on actual path
    global.CONFIGS = path.join(__basedir, 'config/');
    global.DTOS = path.join(__basedir, 'dto/');
    global.UTILS = path.join(__basedir, 'util/');
    global.CONTROLLERS = path.join(__basedir, 'controller/');
    global.ROUTES = path.join(__basedir, 'route/');
    global.MODELS = path.join(__basedir, 'model/');
    global.SERVICES = path.join(__basedir, 'service/');
    global.REPOSITORIES = path.join(__basedir, 'repository/');
    global.VENDORS = path.join(__basedir, 'vendor/');
    global.MIDDLEWARE = path.join(__basedir, 'middleware/');


    global.CORES = path.join(UTILS, 'core/');
    global.VALIDATORS = path.join(UTILS, 'validator/');
    global.MAIN_UTILS = path.join(UTILS, 'main/');
};