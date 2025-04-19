using TASK_FLOW.NET.User.Model;

namespace TASK_FLOW.NET.User.Repository.Interface
{
    public interface IUserRepository
    {
        Task<UsersModel?> FindByIdAsync(int id);
        Task<IEnumerable<UsersModel>> ToListAsync();
        Task <bool> ExistsByEmail(string email);
        Task <bool> ExistsByUsername(string username);
        Task RemoveAsync(UsersModel user);
        Task AddChangeAsync(UsersModel user);
        Task<bool>UpdateAsync(UsersModel user);
        Task<UsersModel?> FindByKey(string key, object value);
    }
}
