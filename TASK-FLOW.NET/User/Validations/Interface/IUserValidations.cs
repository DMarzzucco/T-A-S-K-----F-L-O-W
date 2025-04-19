using TASK_FLOW.NET.User.DTO;

namespace TASK_FLOW.NET.User.Validations.Interface
{
    public interface IUserValidations
    {
        void ValidateEmail (string email);
        void ValidatePassword (string password);
        Task ValidateDuplicated (CreateUserDTO body);
    }
}
