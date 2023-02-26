const Jwt = require('@hapi/jwt');

const configs = require('../../common/utils/configs');

const TokenManager = {
  /**
   * To generate Access Token.
   *
   * @param {object} payload
   * @return {string} token
   */
  generateAccessToken: (payload) => Jwt.token.generate(
      payload, configs.jwt.accessKey,
  ),

  /**
   * To generate Refresh Token.
   *
   * @param {object} payload
   * @return {string} token
   */
  generateRefreshToken: (payload) => Jwt.token.generate(
      payload, configs.jwt.refreshKey,
  ),

  /**
   * Verify Refresh Token Signature.
   *
   * @param {string} refreshToken
   *
   * @throws {InvariantError}
   * @return {object} payload
   */
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);

      Jwt.token.verifySignature(artifacts, configs.jwt.refreshKey);

      const {payload} = artifacts.decoded;

      return payload;
    } catch (error) {
      throw new InvariantError('Invalid Refresh Token');
    }
  },
};

module.exports = TokenManager;
