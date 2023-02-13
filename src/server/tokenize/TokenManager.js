const Jwt = require('@hapi/jwt');

const TokenManager = {
  /**
   * To generate Access Token.
   *
   * @param {object} payload
   * @return {string} token
   */
  generateAccessToken: (payload) => Jwt.token.generate(
      payload, process.env.ACCESS_TOKEN_KEY,
  ),

  /**
   * To generate Refresh Token.
   *
   * @param {object} payload
   * @return {string} token
   */
  generateRefreshToken: (payload) => Jwt.token.generate(
      payload, process.env.REFRESH_TOKEN_KEY,
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

      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);

      const {payload} = artifacts.decoded;

      return payload;
    } catch (error) {
      throw new InvariantError('Invalid Refresh Token');
    }
  },
};

module.exports = TokenManager;
