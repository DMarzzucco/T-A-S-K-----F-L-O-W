using AutoMapper;
using Microsoft.AspNetCore.Identity;
using TASK_FLOW.NET.User.DTO;
using TASK_FLOW.NET.User.Enums;
using TASK_FLOW.NET.User.Model;
using TASK_FLOW.NET.User.Repository.Interface;
using TASK_FLOW.NET.User.Service.Interface;
using TASK_FLOW.NET.User.Validations.Interface;
using TASK_FLOW.NET.Utils.Exceptions;
using TASK_FLOW.NET.Utils.Helpers;

namespace TASK_FLOW.NET.User.Service
{
    public class UserService : IUserService
    {

        private readonly IUserRepository _repository;
        private readonly IUserValidations _validation;
        private readonly CodeGeneration codeGeneration;
        private readonly IMapper _mapper;

        public UserService(IUserRepository repository, IMapper mapper, IUserValidations validations, CodeGeneration codeGeneration)
        {
            this._repository = repository;
            this._mapper = mapper;
            this._validation = validations;
            this.codeGeneration = codeGeneration;
        }
        /// <summary>
        /// Save one Register
        /// </summary>
        /// <param name="body"></param>
        /// <returns></returns>
        public async Task<UsersModel> CreateUser(CreateUserDTO body)
        {
            var code = this.codeGeneration.InvokeCodeGeneration();

            await this._validation.ValidateDuplicated(body.Username);
            await this._validation.ValidateEmail(body.Email);
            this._validation.ValidatePassword(body.Password);

            var data = this._mapper.Map<UsersModel>(body);

            data.VerifyCode = code;
            data.CodeExpiration = DateTime.UtcNow.AddMinutes(10);

            var passwordHasher = new PasswordHasher<UsersModel>();
            data.Password = passwordHasher.HashPassword(data, body.Password);

            await this._repository.AddChangeAsync(data);

            //Simulation of Email sending
            Console.WriteLine($" CODE: Your code of verification is {code}");

            return data;
        }
        /// <summary>
        /// Delete One register
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="KeyNotFoundException"></exception>
        /// <exception cref="UnauthorizedAccessException"></exception>
        public async Task DeleteUser(int id)
        {
            var user = await this._repository.FindByIdAsync(id);
            if (user == null) throw new KeyNotFoundException("User not found");

            if (user.Roles == ROLES.ADMIN)
                throw new UnauthorizedAccessException("You could not deleted a user admin");

            await this._repository.RemoveAsync(user);
        }

        /// <summary>
        /// Remove own account
        /// </summary>
        /// <param name="id"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        /// <exception cref="KeyNotFoundException"></exception>
        /// <exception cref="BadRequestException"></exception>
        public async Task RemoveOwnAccount(int id, PasswordDTO body)
        {
            var user = await this._repository.FindByIdAsync(id) ??
                throw new KeyNotFoundException("user not found");
            var passwordHasher = new PasswordHasher<UsersModel>();
            var verify = passwordHasher.VerifyHashedPassword(user, user.Password, body.Password);

            if (verify == PasswordVerificationResult.Failed)
                throw new BadRequestException("Password is wrong");

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
        /// 
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<PublicUserDTO>> ToListAll()
        {
            var list = await this._repository.ToListAsync();
            var response = this._mapper.Map<IEnumerable<PublicUserDTO>>(list);
            return response;
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
        /// Get user by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="KeyNotFoundException"></exception>
        public async Task<PublicUserDTO> FindUserById(int id)
        {
            var user = await this._repository.FindByIdAsync(id) ??
                throw new KeyNotFoundException("User not found");

            var response = this._mapper.Map<PublicUserDTO>(user);
            return response;
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

            await this._validation.ValidateDuplicated(body.Username);

            if (user.Roles == ROLES.ADMIN)
                throw new UnauthorizedAccessException("You Could not update a Admin User");

            this._mapper.Map(body, user);

            await this._repository.UpdateAsync(user);

            return user;
        }
        /// <summary>
        /// Update User 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        /// <exception cref="KeyNotFoundException"></exception>
        /// <exception cref="BadRequestException"></exception>
        public async Task<string> UpdateOwnUserAccount(int id, UpdateOwnUserDTO body)
        {
            var user = await this._repository.FindByIdAsync(id) ??
               throw new KeyNotFoundException("User not found it");

            var passwordHaser = new PasswordHasher<UsersModel>();
            var verify = passwordHaser.VerifyHashedPassword(user, user.Password, body.Password);

            if (verify == PasswordVerificationResult.Failed)
                throw new BadRequestException("Password is wrong");

            await this._validation.ValidateDuplicated(body.Username);

            this._mapper.Map(body, user);

            await this._repository.UpdateAsync(user);

            return "Your account was updated successfully";
        }

        /// <summary>
        /// Update User Roles 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        /// <exception cref="KeyNotFoundException"></exception>
        public async Task<string> UpdateRolesUser(int id, RolesDTO body)
        {
            var user = await this._repository.FindByIdAsync(id) ??
                throw new KeyNotFoundException("User not was found it");

            user.Roles = body.Roles;

            await this._repository.UpdateAsync(user);
            return $"The rols of user {user.Username} was chanches for {user.Roles} ";
        }
        /// <summary>
        /// Update Email
        /// </summary>
        /// <param name="id"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        /// <exception cref="KeyNotFoundException"></exception>
        /// <exception cref="BadRequestException"></exception>
        public async Task<UsersModel> UpdateEmail(int id, NewEmailDTO body)
        {
            var code = this.codeGeneration.InvokeCodeGeneration();

            var user = await this._repository.FindByIdAsync(id) ??
                    throw new KeyNotFoundException("User not found");

            var passwordHasher = new PasswordHasher<UsersModel>();
            var verify = passwordHasher.VerifyHashedPassword(user, user.Password, body.Password);
            if (verify == PasswordVerificationResult.Failed)
                throw new BadRequestException("Password is wrong");

            await this._validation.ValidateEmail(body.NewEmail);

            user.Email = body.NewEmail;
            user.VerifyEmail = false;
            user.VerifyCode = code;
            user.CodeExpiration = DateTime.UtcNow.AddMinutes(10);

            await this._repository.UpdateAsync(user);

            return user;
        }
        /// <summary>
        /// Update Password
        /// </summary>
        /// <param name="id"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        /// <exception cref="KeyNotFoundException"></exception>
        /// <exception cref="BadRequestException"></exception>
        /// <exception cref="ConflictException"></exception>
        public async Task<string> UpdatePassword(int id, NewPasswordDTO body)
        {
            var date = await this._repository.FindByIdAsync(id) ??
                throw new KeyNotFoundException("User not found");

            var passwordHasher = new PasswordHasher<UsersModel>();

            var verificationPass = passwordHasher.VerifyHashedPassword(date, date.Password, body.OldPassword);
            if (verificationPass == PasswordVerificationResult.Failed)
                throw new BadRequestException("Password is wrong");

            this._validation.ValidatePassword(body.NewPassword);

            var verificationResult = passwordHasher.VerifyHashedPassword(date, date.Password, body.NewPassword);
            if (verificationResult == PasswordVerificationResult.Success)
                throw new ConflictException("The password cannot be the same as the current one");

            date.Password = passwordHasher.HashPassword(date, body.NewPassword);
            await this._repository.UpdateAsync(date);

            return "Password updated successfully";
        }

        /// <summary>
        /// Forget Password
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        /// <exception cref="KeyNotFoundException"></exception>
        public async Task<string> ForgetPassword(ForgetDTO dto)
        {
            var code = this.codeGeneration.InvokeCodeGeneration();

            var user = await this._repository.FindByEmail(dto.Email) ??
                throw new KeyNotFoundException("User not found");

            user.VerifyCode = code;
            user.CodeExpiration = DateTime.UtcNow.AddMinutes(10);

            await this._repository.UpdateAsync(user);

            Console.WriteLine($"your code is: {code}");

            return $"Hi {user.First_name} check your email to return your account";
        }

        /// <summary>
        /// Recuperation Account
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        /// <exception cref="KeyNotFoundException"></exception>
        /// <exception cref="TooManyRequestExceptions"></exception>
        /// <exception cref="ForbiddentExceptions"></exception>
        /// <exception cref="ConflictException"></exception>
        public async Task<UsersModel> RecuperationAccount(RecuperationDTO dto)
        {
            var user = await this._repository.FindByEmail(dto.Email) ??
                throw new KeyNotFoundException("User not found it");

            var passwordHasher = new PasswordHasher<UsersModel>();
            var verifyPassword = passwordHasher.VerifyHashedPassword(user, user.Password, dto.Password);

            if (user.LockedUntil != null && DateTime.UtcNow < user.LockedUntil)
                throw new TooManyRequestExceptions("Account locked due to multple failed attemp, Try againt later");

            if (user.VerifyCode != dto.VerifyCode || user.CodeExpiration < DateTime.UtcNow)
            {
                user.VerifyAttempts++;
                if (user.VerifyAttempts >= 3)
                {
                    user.LockedUntil = DateTime.UtcNow.AddMinutes(5);
                    user.VerifyAttempts = 0;
                }

                await this._repository.UpdateAsync(user);

                throw new ForbiddentExceptions("Code is invalid or is expired");
            }

            this._validation.ValidatePassword(dto.Password);

            if (verifyPassword == PasswordVerificationResult.Success)
                throw new ConflictException("The password could not be same at old");

            user.VerifyCode = "";
            user.CodeExpiration = null;
            user.VerifyAttempts = 0;
            user.LockedUntil = null;
            user.Password = passwordHasher.HashPassword(user, dto.Password);

            await this._repository.UpdateAsync(user);

            return user;
        }

        /// <summary>
        /// Verify Email Adress
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        /// <exception cref="KeyNotFoundException"></exception>
        /// <exception cref="ForbiddentExceptions"></exception>
        /// <exception cref="TooManyRequestExceptions"></exception>
        public async Task<string> MarkVerify(VerifyDTO dto)
        {
            var user = await this._repository.FindByEmail(dto.Email) ??
                throw new KeyNotFoundException("User not found");

            if (user.VerifyEmail == true)
                throw new ForbiddentExceptions("This user was verify");

            if (user.LockedUntil != null && DateTime.UtcNow < user.LockedUntil)
                throw new TooManyRequestExceptions("Account locked due to multiple failed attemps. Try again later");

            if (user.VerifyCode != dto.VerifyCode || user.CodeExpiration < DateTime.UtcNow)
            {
                user.VerifyAttempts++;

                if (user.VerifyAttempts >= 3)
                {
                    user.LockedUntil = DateTime.UtcNow.AddMinutes(5);
                    user.VerifyAttempts = 0;
                }
                await this._repository.UpdateAsync(user);
                throw new ForbiddentExceptions("Code is invalid or is expired");
            }
            user.VerifyEmail = true;
            user.VerifyCode = "";
            user.CodeExpiration = null;
            user.VerifyAttempts = 0;
            user.LockedUntil = null;

            await this._repository.UpdateAsync(user);

            return $"Hi {user.First_name} {user.Last_name} your account was verify";
        }
    }
}
