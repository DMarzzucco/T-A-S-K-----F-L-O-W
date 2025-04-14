using System.Text.RegularExpressions;
using TASK_FLOW.NET.User.DTO;
using TASK_FLOW.NET.User.Repository.Interface;
using TASK_FLOW.NET.User.Validations.Interface;
using TASK_FLOW.NET.Utils.Exceptions;

namespace TASK_FLOW.NET.User.Validations
{
    public class UsersValidations(IUserRepository repository) : IUserValidations
    {
        private readonly IUserRepository _repository;

        public void ValidationCreateUser(CreateUserDTO body)
        {
         var validations = new List<(bool isInvalid, Exception Error)>
        {
        // conflict between repeated values 
        (_repository.ExistisByUsername(body.Username), new ConflictExceptions("This username already exists")),
        (_repository.ExistisByEmail(body.Email), new ConflictExceptions("This email already exists")),
        // Email Validation
        (!Regex.IsMatch(body.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"), new BadRequestExceptions("Invalid email address")),
        //password validations 
        (body.Password.Length < 8, new BadRequestExceptions("Password must be at least 8 characters long.")),
        (!body.Password.Any(char.IsDigit), new BadRequestExceptions("Password must contain at least one digit")),
        (!body.Password.Any(char.IsUpper), new BadRequestExceptions("Password must contain at least one upper case letter")),
        (!body.Password.Any(ch => !char.IsLetterOrDigit(ch)), new BadRequestExceptions("Password must contain at least one special character"))
        };

        var firstError = validations.FirstOrDefault(v => v.isInvalid);
        if (firstError != default)
            throw firstError.Error;
        }
    }
}
