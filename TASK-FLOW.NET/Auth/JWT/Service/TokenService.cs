using TASK_FLOW.NET.User.Model;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using TASK_FLOW.NET.Auth.JWT.Service.Interface;
using TASK_FLOW.NET.Auth.JWT.DTO;
using TASK_FLOW.NET.Auth.JWT.Helper.Interfaces;

namespace TASK_FLOW.NET.Auth.JWT.Service
{

    public class TokenService : ITokenService
    {
        private readonly string _secretKey;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ITokenCreationServices _tokenCreation;

        public TokenService(IConfiguration config, IHttpContextAccessor httpContextAccessor, ITokenCreationServices tokenCreation)
        {
            var secretKeySection = config.GetSection("JwtSettings").GetSection("secretKey").ToString();
            if (secretKeySection == null || string.IsNullOrEmpty(secretKeySection))
            {
                throw new ArgumentNullException("Secret key configuration is missing");
            }
            this._secretKey = secretKeySection;
            this._httpContextAccessor = httpContextAccessor;
            _tokenCreation = tokenCreation;
        }

        /// <summary>
        /// Get Id from Token 
        /// </summary>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
        public int GetIdFromClaim()
        {
            var httpContext = this._httpContextAccessor.HttpContext ??
                throw new UnauthorizedAccessException("HttpContext is null");

            var token = httpContext.Request.Cookies["Authentication"] ??
                throw new UnauthorizedAccessException("Token not found");

            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadToken(token) as JwtSecurityToken;

            var IdClaim = jwtToken?.Claims.FirstOrDefault(c => c.Type == "sub")?.Value ??
                throw new UnauthorizedAccessException("Invalid Token");

            return int.Parse(IdClaim);
        }
        /// <summary>
        /// Generate Token
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public TokenPair GenerateAuthenticationToken(UsersModel user)
        {
            return this._tokenCreation.CreateTokenPair(
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
        public TokenPair GenerateRefreshToken(UsersModel user)
        {
            return this._tokenCreation.CreateTokenPair(
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
        public bool ValidateAuthenticationToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var keyBytes = Encoding.UTF8.GetBytes(this._secretKey);

            if (tokenHandler.ReadToken(token) is not JwtSecurityToken jwtToken) return false;

            if (jwtToken.ValidTo < DateTime.UtcNow) return false;

            var principal = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            tokenHandler.ValidateToken(token, principal, out _);
            return true;
        }
        /// <summary>
        ///  is Token Expire Soon
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        public bool IsTokenExpireSoon(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            if (!handler.CanReadToken(token)) return false;

            if (handler.ReadToken(token) is not JwtSecurityToken jwtToken) return false;

            var expiration = jwtToken.ValidTo;
            return expiration <= DateTime.UtcNow.AddMinutes(21);
        }
    }

}