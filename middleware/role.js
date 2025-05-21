module.exports = (roles = []) => {
    // roles can be a single role or an array of roles
    if (typeof roles === 'string') {
      roles = [roles];
    }
  
    return (req, res, next) => {
      const user = req.user;
  
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' }); //fix this based on current implementation
      }
  
      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied' }); //fix this based on current implementation
      }
      
      next();
    };
  };
  
    //to use
    // const requireRole = require('../middlewares/role.middleware');

    // router.get('/dashboard', requireRole('admin'), (req, res) => {
    //     res.json({ message: 'Welcome, Admin!' });
    //   });
      
    //   router.get('/manage-users', requireRole(['admin', 'editor']), (req, res) => {
    //     res.json({ message: 'Editor/Admin access granted' });
    //   });