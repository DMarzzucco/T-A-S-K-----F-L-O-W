using TASK_FLOW.NET.Auth.DTO;
using TASK_FLOW.NET.User.DTO;
using TASK_FLOW.NET.User.Model;

namespace TASK_FLOW.NET.Auth.Service.Interface
{
    public interface IAuthService
    {
        Task<UsersModel> ValidationUser(AuthPropsDTO body);
        Task<string> RefreshToken();
        Task<string> GenerateToken(UsersModel body);
        Task<UsersModel> GetUserByCookie();
        Task<string> GetProfile();
        Task<UsersModel> RefreshTokenValidate(string refreshToken, int id);
        Task<string> Logout();
        Task<string> RegisterUser(CreateUserDTO body);
        Task<string> UpdateEmail(int id, NewEmailDTO body);
        Task<string> RemoveOwnAccount(int id, PasswordDTO body);
        Task<string> VerifyAccount(VerifyDTO dto);
        Task<string> ForgetAccount(ForgetDTO dto);
        Task<string> RecuperatioAccount(RecuperationDTO dto);
    }
}
