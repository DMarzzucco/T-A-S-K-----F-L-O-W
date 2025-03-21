using TASK_FLOW.NET.User.Model;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using TASK_FLOW.NET.Auth.JWT.Service.Interface;
using TASK_FLOW.NET.Auth.JWT.DTO;

namespace TASK_FLOW.NET.Auth.JWT.Service
{

    public class TokenService : ITokenService
    {
        private readonly string _secretKey;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public TokenService(IConfiguration config, IHttpContextAccessor httpContextAccessor)
        {
            var secretKeySection = config.GetSection("JwtSettings").GetSection("secretKey").ToString();
            if (secretKeySection == null || string.IsNullOrEmpty(secretKeySection))
            {
                throw new ArgumentNullException("Secret key configuration is missing");
            }
            this._secretKey = secretKeySection;
            this._httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        /// Get Id from Token 
        /// </summary>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
        public int GetIdFromToken()
        {
            var httpContext = this._httpContextAccessor.HttpContext;
            if (httpContext == null) throw new UnauthorizedAccessException("HttpContext is null");
            
            var token = httpContext.Request.Cookies["Authentication"];
            if (token == null) throw new UnauthorizedAccessException("Token not found");

            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadToken(token) as JwtSecurityToken;

            var IdClaim = jwtToken?.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
            if (IdClaim == null) throw new UnauthorizedAccessException("Invalid Token");

            return int.Parse(IdClaim);
        }
        /// <summary>
        /// Generate Token
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public TokenPair GenerateToken(UsersModel user)
        {
            return CreateTokenPair(
                user,
                DateTime.UtcNow.AddHours(1),
                DateTime.UtcNow.AddDays(5)
           );
        }
        /// <summary>
        ///  Refresh Token 
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public TokenPair RefreshToken(UsersModel user)
        {
            return CreateTokenPair(
                user,
                DateTime.UtcNow.AddDays(5),
                DateTime.UtcNow.AddDays(5)
                );
        }
        /// <summary>
        ///  Validate Token
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        public bool ValidateToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var keyBytes = Encoding.UTF8.GetBytes(this._secretKey);

            var principal = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            try
            {
                tokenHandler.ValidateToken(token, principal, out _);
                return true;

            }
            catch (SecurityTokenExpiredException)
            {
                return false;
            }
        }
        /// <summary>
        ///  is Token Expire Soon
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        public bool isTokenExpireSoon(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            if (!handler.CanReadToken(token)) return false;

            var jwtToken = handler.ReadToken(token) as JwtSecurityToken;
            if (jwtToken == null) return false;

            var expiration = jwtToken.ValidTo;
            return expiration <= DateTime.UtcNow.AddMinutes(21);
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
        /// <summary>
        /// Create Token Template
        /// </summary>
        /// <param name="claims"></param>
        /// <param name="signingCredentials"></param>
        /// <param name="expiration"></param>
        /// <returns></returns>
        private string CreateToken(IEnumerable<Claim> claims, SigningCredentials signingCredentials, DateTime expiration)
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
    }

}