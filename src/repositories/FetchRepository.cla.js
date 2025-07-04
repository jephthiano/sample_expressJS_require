const User = require('@model/User.schema');
const { selEncrypt, }  = require('@main_util/security.util');

class FetchRepository
{

    static async getUserById(res, id) {
        return await User.findOne({_id : id});
    }
}

module.exports = FetchRepository;