
const log = (containerName, data, type='error') => {
    // type can be error, info
    if(type === 'error'){
        console.error(containerName, type, data);
    }else{
        console.log(containerName, type, data);
    }
};

module.exports = {
    log,
};
