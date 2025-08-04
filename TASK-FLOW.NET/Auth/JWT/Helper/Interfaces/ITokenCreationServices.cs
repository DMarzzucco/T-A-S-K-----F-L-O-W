using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using TASK_FLOW.NET.Auth.JWT.DTO;
using TASK_FLOW.NET.User.Model;

namespace TASK_FLOW.NET.Auth.JWT.Helper.Interfaces
{
    public interface ITokenCreationServices
    {
        TokenPair CreateTokenPair(UsersModel user, DateTime accessTokenExpired, DateTime refreshTokenExpired);
        string CreateToken(IEnumerable<Claim> claims, SigningCredentials signingCredentials, DateTime expiration);
    }
}
