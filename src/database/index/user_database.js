const _CRYPTO = require('crypto');
const _ARGON2 = require('argon2');
const _PATH = require('path');
const _OBSCENITY = require('obscenity');
const _DATABASE = require(_PATH.join(global.__path.src, 'database', 'database'));



const ERROR = {
  none: -1,
  username: {
    too_short: 0,
    too_long: 1,
    trimmable: 2,
    profanity: 3,
    taken: 6,
  },
  password: {
    too_short: 4,
    too_long: 5
  },
  email: {
    taken: 7
  },
  account: {
    creation: 8
  },
  login: {
    invalid: 9,
    session: 10
  }
};


/**
 * The class to hold the user database for logins.
 *
 * @class UserDatabase
 * @typedef {UserDatabase}
 * @extends {_DATABASE.Database}
 */
class UserDatabase extends _DATABASE.Database {

  /**
   * Creates an instance of UserDatabase.
   *
   * @constructor
   */
  constructor() {
    super(_PATH.join('index', 'users.db'));

    this.findByEmailLookupStatement = this.db.prepare('SELECT * FROM Users WHERE Users.EmailLookup = ?');

    this.profanityMatcher = new _OBSCENITY.RegExpMatcher({..._OBSCENITY.englishDataset.build(),
                            ..._OBSCENITY.englishRecommendedTransformers});
  }

  async addUser(name, passwordHash, emailLookup, emailEnc, emailIV, emailTag) {
    await this.execute('INSERT INTO Users (Name, Password, EmailLookup, EmailEnc, EmailIV, EmailTag, CreatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [name, passwordHash, emailLookup, emailEnc, emailIV, emailTag, Date.now()]);
  }

  async findByName(name) {
    return await this.query('SELECT * FROM Users WHERE Users.Name = ?',
           [name]);
  }

  async findByEmailLookup(emailLookup) {
    return await this.query('SELECT * FROM Users WHERE Users.EmailLookup = ?',
          [emailLookup]);
  }

  validateName(name) {
    var u = String(name || '');
    if (global.__config.server.users.name.min_length != -1
        && u.length < global.__config.server.users.name.min_length)
      return ERROR.username.too_short;
    if (global.__config.server.users.name.max_length != -1
        && u.length > global.__config.server.users.name.max_length)
      return ERROR.username.too_long;
    if (u.trim() != u)
      return ERROR.username.trimmable;
    if (this.profanityMatcher.hasMatch(name))
      return ERROR.username.profanity;
    return ERROR.none;
  }

  validatePassword(password) {
    var p = String(password || '');
    if (global.__config.server.users.password.min_length != -1
        && p.length < global.__config.server.users.password.min_length)
      return ERROR.password.too_short;
    if (global.__config.server.users.password.max_length != -1
        && p.length > global.__config.server.users.password.max_length)
      return ERROR.password.too_long;
    return ERROR.none;
  }

  emailLookup(email, hmacKey) {
    var key = Buffer.from(hmacKey, 'base64');
    return _CRYPTO.createHmac('sha256', key).update(email, 'utf8').digest('hex');
  }

  getEmail(user) {
    var key = process.env[global.__config.server.users.email_enc_key];
    key = Buffer.from(key, 'base64');
    var iv = Buffer.from(user.EmailIV, 'base64');
    var tag = Buffer.from(user.EmailTag, 'base64');
    var cipherText = Buffer.from(user.EmailEnc, 'base64');

    var decipher = _CRYPTO.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    
    var email = Buffer.concat([decipher.update(cipherText), decipher.final()]);
    return email.toString('utf8');
  }

  encryptEmail(email, encKey) {
    var key = Buffer.from(encKey, 'base64');
    var iv = _CRYPTO.randomBytes(12);
    var cipher = _CRYPTO.createCipheriv('aes-256-gcm', key, iv);

    var ciphertext = Buffer.concat([
      cipher.update(String(email), "utf8"),
      cipher.final(),
    ]);
    var tag = cipher.getAuthTag();

    return {
      email_enc: ciphertext.toString("base64"),
      email_iv: iv.toString("base64"),
      email_tag: tag.toString("base64"),
    };
  }

  normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  async register(name, email, password) {
    var nameError = this.validateName(name);
    if (nameError != ERROR.none)
      return nameError;
    var passwordError = this.validatePassword(password);
    if (passwordError != ERROR.none)
      return passwordError;
    var normalizedEmail = this.normalizeEmail(email);

    if (await this.findByName(name).length > 0)
      return ERROR.username.taken;

    var emailLookup = this.emailLookup(normalizedEmail, process.env[global.__config.server.users.email_hmac_key]);
    if (await this.findByEmailLookup(emailLookup).length > 0)
      return ERROR.email.taken;

    var passwordHash = await _ARGON2.hash(password, { type: _ARGON2.argon2id });
    var encryptedEmail = this.encryptEmail(normalizedEmail, process.env[global.__config.server.users.email_enc_key]);
    
    try {
      await this.addUser(name, passwordHash, emailLookup, encryptedEmail.email_enc, encryptedEmail.email_iv, encryptedEmail.email_tag);
      return ERROR.none;
    } catch (e) {
      return ERROR.account.creation;
    }
  }

  async login(name, password, request, result) {
    var nameError = this.validateName(name);
    if (nameError != ERROR.none)
      return nameError;
    var passwordError = this.validatePassword(password);
    if (passwordError != ERROR.none)
      return passwordError;


    var user = await this.findByName(name);
    if (user.length <= 0) {
      await _ARGON2.hash('time-wasting-password-to-hash');
      return ERROR.login.invalid;
    }
    user = user[0];

    var passwordMatch = await _ARGON2.verify(user.Password, password);
    if (!passwordMatch)
      return ERROR.login.invalid;

    try {
      return await new Promise((resolve, reject) => {
        request.session.regenerate((err) => {
          if (err)
            return resolve(ERROR.login.session);
          request.session.userId = user.UserID;
          request.session.userName = user.Name;
          request.session.save();
          
          return resolve(ERROR.none);
        })
      });
    } catch (e) {
      return ERROR.login.session;
    }
  }

  async logout(request, result) {
    request.session.destroy(() => {
      result.clearCookie('sid');
      result.json({ ok: true });
    });
  }

}

UserDatabase.instance = new UserDatabase();
UserDatabase.instance.ERROR = ERROR;

module.exports.UserDatabase = UserDatabase;