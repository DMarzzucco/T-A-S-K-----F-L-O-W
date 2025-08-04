using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TASK_FLOW.NET.Auth.JWT.DTO;
using TASK_FLOW.NET.Auth.JWT.Helper.Interfaces;
using TASK_FLOW.NET.User.Model;

namespace TASK_FLOW.NET.Auth.JWT.Helper
{
    public class TokenCreationServices : ITokenCreationServices
    {

        private readonly string _secretKey;

        public TokenCreationServices(IConfiguration configuration)
        {
            var secretKeySection = configuration.GetSection("JwtSettings").GetSection("secretKey").ToString();
            if (secretKeySection == null || string.IsNullOrEmpty(secretKeySection))
            {
                throw new ArgumentNullException("Secret key configuration is missing");
            }
            this._secretKey = secretKeySection;
        }

        /// <summary>
        /// Create Token Template
        /// </summary>
        /// <param name="claims"></param>
        /// <param name="signingCredentials"></param>
        /// <param name="expiration"></param>
        /// <returns></returns>
        public string CreateToken(IEnumerable<Claim> claims, SigningCredentials signingCredentials, DateTime expiration)
        {
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expiration,
                SigningCredentials = signingCredentials
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            return tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
        }

        /// <summary>
        ///  Create Token Pair Template
        /// </summary>
        /// <param name="user"></param>
        /// <param name="accessTokenExpired"></param>
        /// <param name="refreshTokenExpired"></param>
        /// <returns></returns>
        public TokenPair CreateTokenPair(UsersModel user, DateTime accessTokenExpired, DateTime refreshTokenExpired)
        {

            var keyBytes = Encoding.UTF8.GetBytes(this._secretKey);
            var signingCredential = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256Signature);

            var claims = new List<Claim>
            {
                new Claim("sub", user.Id.ToString()),
                new Claim ("rol", user.Id.ToString())
            };

            var accessToken = CreateToken(claims, signingCredential, accessTokenExpired);
            var refreshToken = CreateToken(claims, signingCredential, refreshTokenExpired);

            var refreshTokenHash = BCrypt.Net.BCrypt.HashPassword(refreshToken);

            return new TokenPair
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                RefreshTokenHasher = refreshTokenHash
            };
        }
    }
}
