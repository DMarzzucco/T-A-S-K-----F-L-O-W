using TASK_FLOW.NET.User.DTO;
using TASK_FLOW.NET.User.Model;

namespace TASK_FLOW.NET.User.Service.Interface
{
    public interface IUserService
    {
        Task<UsersModel> GetById(int id);
        Task<UsersModel> CreateUser(CreateUserDTO body);
        Task<UsersModel> UpdateUser(int id, UpdateUserDTO body);
        Task DeleteUser(int id);
        Task<UsersModel> FindByAuth(string key, object value);
        Task<UsersModel> UpdateToken(int id, string RefreshToken);
        Task<string> UpdatePassword (int id, NewPasswordDTO body);
        Task<UsersModel> UpdateEmail(int id, NewEmailDTO body);
        Task<string> UpdateRolesUser(int id, RolesDTO body);
        Task<string> UpdateOwnUserAccount(int id, UpdateOwnUserDTO body);
        Task RemoveOwnAccount(int id, PasswordDTO body);
        Task<string> MarkVerify(VerifyDTO dto);
        Task<string> ForgetPassword(ForgetDTO dto);
        Task<UsersModel> RecuperationAccount(RecuperationDTO dto);
        Task<PublicUserDTO> FindUserById(int id);
        Task<IEnumerable<PublicUserDTO>> ToListAll();
    }
}