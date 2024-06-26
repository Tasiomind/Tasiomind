import db from '~db/models/';
import UserDS from './user';
import FileDS from './file';
import RoleDS from './role';
import PermissionDS from './permission';
import ApplicationDS from './application';
import ApplicationSettingsDS from './applicationSettings';

const dataSources = {
  users: new UserDS(db.User),
  files: new FileDS(db.File),
  roles: new RoleDS(db.Role),
  permissions: new PermissionDS(db.Permission),
  applications: new ApplicationDS(db.Application),
  applicationSettings: new ApplicationSettingsDS(db.ApplicationSettings),
};

export default dataSources;
