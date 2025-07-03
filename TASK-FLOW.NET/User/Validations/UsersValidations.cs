using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TASK_FLOW.NET.User.DTO;
using TASK_FLOW.NET.User.Repository.Interface;
using TASK_FLOW.NET.User.Validations.Interface;
using TASK_FLOW.NET.Utils.Exceptions;

namespace TASK_FLOW.NET.User.Validations
{
    public class UsersValidations(IUserRepository repository) : IUserValidations
    {
        private readonly IUserRepository _repository = repository;

        /// <summary>
        /// ValidateUsernameDuplicated
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        public async Task ValidateDuplicated(string username)
        {
            var normalizedUsername = username.Trim().ToLowerInvariant();

            var validations = new List<(bool isInvalid, Exception Error)>
            {
                (await this._repository.ExistsByUsername(normalizedUsername), new ConflictException("This username already exists")),
            };
            var firstError = validations.FirstOrDefault(v => v.isInvalid);
            if (firstError != default)
                throw firstError.Error;
        }

        /// <summary>
        /// Validate Email
        /// </summary>
        /// <param name="email"></param>
        /// <exception cref="NotImplementedException"></exception>
        public async Task ValidateEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
                throw new BadRequestException("Email is required");

            if (!Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
                throw new BadRequestException("Invalid email addres");

            var disposableDomains = new[] { "gmail.com", "hotmail.com", "outlook.com", "icloud.com", "yahoo.com" };

            var parts = email.Split('@');
            if (parts.Length != 2)
                throw new BadRequestException("Invalid Email format");

            var emailDomains = parts[1];

            var normalizedEmail = email.Trim().ToLowerInvariant();

            var validations = new List<(bool isInvalid, Exception Error)>
            {
                (email.Length > 320, new BadRequestException ("Enail is too long")),
                (!disposableDomains.Contains(emailDomains), new BadRequestException ("Disposable email domains are not allowed")),
                (await this._repository.ExistsByEmail(normalizedEmail), new ConflictException("This Email already exist"))
            };

            var firstError = validations.FirstOrDefault(v => v.isInvalid);
            if (firstError != default)
                throw firstError.Error;
        }

        /// <summary>
        /// Validate Password
        /// </summary>
        /// <param name="password"></param>
        /// <exception cref="NotImplementedException"></exception>
        public void ValidatePassword(string password)
        {

            var validations = new List<(bool isInvalid, Exception Error)>
            {
                (password.Length < 8, new BadRequestException("Password must be at least 8 characters long.")),
                (!password.Any(char.IsDigit), new BadRequestException("Password must contain at least one digit")),
                (!password.Any(char.IsUpper), new BadRequestException("Password must contain at least one upper case letter")),
                (!password.Any(ch => !char.IsLetterOrDigit(ch)), new BadRequestException("Password must contain at least one special character"))
            };

            var firstError = validations.FirstOrDefault(v => v.isInvalid);
            if (firstError != default)
                throw firstError.Error;
        }

    }
}
