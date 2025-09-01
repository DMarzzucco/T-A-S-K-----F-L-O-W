using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TASK_FLOW.NET.Context;
using TASK_FLOW.NET.User.Model;
using TASK_FLOW.NET.User.Repository.Interface;
using TASK_FLOW.NET.UserProject.Model;

namespace TASK_FLOW.NET.User.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDBContext _context;

        public UserRepository(AppDBContext context)
        {
            this._context = context;
        }

        /// <summary>
        ///  Add Change Async 
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task AddChangeAsync(UsersModel user)
        {
            this._context.UserModel.Add(user);
            await this._context.SaveChangesAsync();
        }

        /// <summary>
        ///  Exist By Email
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        public async Task<bool> ExistsByEmail(string email)
        {
            var normalizedEmail = email.Trim().ToLowerInvariant();
            return await this._context.UserModel.AnyAsync(u => u.Email.ToLower() == normalizedEmail);
        }

        /// <summary>
        /// Exists By Username 
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        public async Task<bool> ExistsByUsername(string username)
        {
            var normalizedUsername = username.Trim().ToLowerInvariant();
            return  await this._context.UserModel.AnyAsync(u => u.Username.ToLower() == normalizedUsername);
        }

        /// <summary>
        /// To List Async 
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<UsersModel>> ToListAsync()
        {
            return await this._context.UserModel
                .AsNoTracking()
                .Select(u => new UsersModel
                {
                    Id = u.Id,
                    First_name = u.First_name,
                    Last_name = u.Last_name,
                    Age = u.Age,
                    Username = u.Username,
                    Email = u.Email,
                    VerifyEmail = u.VerifyEmail,
                    VerifyCode = u.VerifyCode,
                    CodeExpiration = u.CodeExpiration,
                    Password = u.Password,
                    Roles = u.Roles,
                    RefreshToken = u.RefreshToken,
                    ProjectIncludes = new List<UserProjectModel>()
                }).ToListAsync();
        }

        /// <summary>
        /// Find By Id Async 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<UsersModel?> FindByIdAsync(int id)
        {
            var user = await this._context.UserModel
                .Include(u => u.ProjectIncludes)
                    .ThenInclude(pi => pi.Project)
                        .ThenInclude(pi=> pi.Tasks)
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null) return null;

            user.ProjectIncludes ??= new List<UserProjectModel>();
            return user;
        }

        /// <summary>
        /// Retun User model by Email adress
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        public async Task<UsersModel?> FindByEmail(string email) 
        {
            return await this._context.UserModel
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        /// <summary>
        /// Find By Key
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public async Task<UsersModel?> FindByKey(string key, object value)
        {
            var user = await this._context.UserModel
                .AsQueryable()
                .Where(u => EF.Property<object>(u, key).Equals(value))
                .SingleOrDefaultAsync();
            return user;
        }
        /// <summary>
        /// Remove Async 
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task RemoveAsync(UsersModel user)
        {
            this._context.UserModel.Remove(user);
            await this._context.SaveChangesAsync();
        }

        /// <summary>
        /// Update Async 
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<bool> UpdateAsync(UsersModel user)
        {
            var date = await this._context.UserModel.FirstOrDefaultAsync(u => u.Id == user.Id);

            if (date == null) return false;

            var existingUser = this._context.UserModel.Local.FirstOrDefault(u => u.Id == user.Id);

            if (existingUser != null)
            {
                this._context.Entry(existingUser).State = EntityState.Detached;
            }

            this._context.Attach(user);

            this._context.UserModel.Entry(user).State = EntityState.Modified;
            await this._context.SaveChangesAsync();

            return true;
        }
    }
}
