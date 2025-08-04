using TASK_FLOW.NET.Auth.JWT.DTO;
using TASK_FLOW.NET.User.Model;

namespace TASK_FLOW.NET.Auth.JWT.Service.Interface
{
    public interface ITokenService
    {
        TokenPair GenerateAuthenticationToken(UsersModel user);
        TokenPair GenerateRefreshToken(UsersModel user);
        bool ValidateAuthenticationToken(string token);
        int GetIdFromClaim();
        bool IsTokenExpireSoon(string token);
    }
}
