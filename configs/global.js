// Declaring Global variables

const path = require('path');

module.exports = function () {
    global.__basedir = __dirname.replace('/configs', ''); // Adjust based on actual path
    global.CONFIGS = path.join(__basedir, 'configs/');
    global.DTOS = path.join(__basedir, 'dtos/');
    global.UTILS = path.join(__basedir, 'utils/');
    global.CONTROLLERS = path.join(__basedir, 'controllers/');
    global.ROUTES = path.join(__basedir, 'routes/');
    global.MODELS = path.join(__basedir, 'models/');
    global.SERVICES = path.join(__basedir, 'services/');
    global.REPOSITORIES = path.join(__basedir, 'repositories/');
    global.MIDDLEWARE = path.join(__basedir, 'middleware/');
    global.RESOURCES = path.join(__basedir, 'resources/');
    global.QUEUES = path.join(__basedir, 'queues/');
    global.WORKERS = path.join(__basedir, 'workers/');
    

    global.CORES = path.join(UTILS, 'cores/');
    global.VALIDATORS = path.join(UTILS, 'validators/');
    global.MAIN_UTILS = path.join(UTILS, 'mains/');
    global.SERVICE_UTILS = path.join(UTILS, 'services/');
};