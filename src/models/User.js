/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.username = null;
    this.authentication = null;
    this.status = null;
    this.birthDate = null;
    this.creationDate = null;
    Object.assign(this, data);
  }
}
export default User;
