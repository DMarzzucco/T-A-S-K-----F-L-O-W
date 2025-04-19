using AutoMapper;
using Microsoft.AspNetCore.Identity;
using TASK_FLOW.NET.User.DTO;
using TASK_FLOW.NET.User.Model;
using TASK_FLOW.NET.User.Repository.Interface;
using TASK_FLOW.NET.User.Service.Interface;
using TASK_FLOW.NET.User.Validations.Interface;
using TASK_FLOW.NET.Utils.Exceptions;

namespace TASK_FLOW.NET.User.Service
{
    public class UserService : IUserService
    {

        private readonly IUserRepository _repository;
        private readonly IUserValidations _validation;
        private readonly IMapper _mapper;

        public UserService(IUserRepository repository, IMapper mapper, IUserValidations validations)
        {
            this._repository = repository;
            this._mapper = mapper;
            this._validation = validations;
        }
        /// <summary>
        /// Save one Register
        /// </summary>
        /// <param name="body"></param>
        /// <returns></returns>
        public async Task<UsersModel> CreateUser(CreateUserDTO body)
        {
            await this._validation.ValidateDuplicated(body);
            this._validation.ValidateEmail(body.Email);
            this._validation.ValidatePassword(body.Password);

            var data = this._mapper.Map<UsersModel>(body);

            var passwordHasher = new PasswordHasher<UsersModel>();
            data.Password = passwordHasher.HashPassword(data, body.Password);

            await this._repository.AddChangeAsync(data);
            return data;
        }
        /// <summary>
        /// Delete One register
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="KeyNotFoundException"></exception>
        public async Task DeleteUser(int id)
        {
            var user = await this._repository.FindByIdAsync(id);
            if (user == null) throw new KeyNotFoundException("User not found");
            await this._repository.RemoveAsync(user);
        }

        /// <summary>
        /// Fin by value key
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        /// <exception cref="KeyNotFoundException"></exception>
        public async Task<UsersModel> FindByAuth(string key, object value)
        {
            var user = await this._repository.FindByKey(key, value);
            if (user == null) throw new KeyNotFoundException("User not found");
            return user;
        }
        /// <summary>
        /// Get all Users Register
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<UsersModel>> GetAll()
        {
            return await this._repository.ToListAsync();
        }

        /// <summary>
        /// Get One Register
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="KeyNotFoundException"></exception>
        public async Task<UsersModel> GetById(int id)
        {
            var user = await this._repository.FindByIdAsync(id);
            if (user == null) throw new KeyNotFoundException(" User not found");
            return user;
        }

        /// <summary>
        /// Update RefrehsToken
        /// </summary>
        /// <param name="id"></param>
        /// <param name="RefreshToken"></param>
        /// <returns></returns>
        /// <exception cref="KeyNotFoundException"></exception>
        public async Task<UsersModel> UpdateToken(int id, string RefreshToken)
        {
            var user = await this._repository.FindByIdAsync(id);
            if (user == null) throw new KeyNotFoundException("Invalid Id Provider");

            user.RefreshToken = RefreshToken;

            await this._repository.UpdateAsync(user);
            return user;
        }

        /// <summary>
        /// Update one Register
        /// </summary>
        /// <param name="id"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        /// <exception cref="KeyNotFoundException"></exception>
        public async Task<UsersModel> UpdateUser(int id, UpdateUserDTO body)
        {
            var user = await this._repository.FindByIdAsync(id) ??
                throw new KeyNotFoundException("User not found");
                
            this._mapper.Map(body, user);

            await this._repository.UpdateAsync(user);

            return user;
        }

        /// <summary>
        /// Updated password 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="oldPassword"></param>
        /// <param name="newPassword"></param>
        /// <returns></returns>
        public async Task<string> UpdatePassword (int id, string oldPassword, string newPassword)
        {
            var date = await this._repository.FindByIdAsync(id) ??
                throw new KeyNotFoundException ("User not found");

            var passwordHasher = new PasswordHasher<UsersModel>();

            var verificationPass = passwordHasher.VerifyHashedPassword(date, date.Password, oldPassword);
            if (verificationPass == PasswordVerificationResult.Failed)
                throw new BadRequestException("Password is wrong");
            
            this._validation.ValidatePassword(newPassword);

            var verificationResult = passwordHasher.VerifyHashedPassword(date, date.Password, newPassword);
            if (verificationResult == PasswordVerificationResult.Success)
                throw new ConflictException ("The password cannot be the same as the current one");

            date.Password = passwordHasher.HashPassword (date, newPassword);
            await this._repository.UpdateAsync(date);

            return "Password updated successfully";
        }
    }
}
