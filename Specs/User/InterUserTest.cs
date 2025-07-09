using System.Threading.Tasks;
using AutoMapper;
using Moq;
using Specs.Auth.Mock;
using Specs.User.Mocks;
using TASK_FLOW.NET.User.DTO;
using TASK_FLOW.NET.User.Model;
using TASK_FLOW.NET.User.Repository.Interface;
using TASK_FLOW.NET.User.Service;
using TASK_FLOW.NET.User.Validations.Interface;
using TASK_FLOW.NET.Utils.Helpers;

namespace Specs.User
{
    public class InterUserTest
    {
        private readonly Mock<IUserRepository> _repository;
        private readonly Mock<IUserValidations> _validations;
        private readonly Mock<CodeGeneration> codeGeneration;
        private readonly IMapper _mapper;
        private readonly UserService _service;

        public InterUserTest()
        {
            this._repository = new Mock<IUserRepository>();
            this._validations = new Mock<IUserValidations>();

            var conf = new MapperConfiguration(conf =>
            {
                conf.CreateMap<CreateUserDTO, UsersModel>();
                conf.CreateMap<UpdateUserDTO, UsersModel>();
                conf.CreateMap<UpdateOwnUserDTO, UsersModel>();
                conf.CreateMap<UsersModel, PublicUserDTO>();
            });
            this.codeGeneration = new Mock<CodeGeneration>();
            this._mapper = conf.CreateMapper();

            this._service = new UserService(
                this._repository.Object,
                this._mapper,
                this._validations.Object,
                this.codeGeneration.Object
                );
        }

        /// <summary>
        /// Create a User
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldCreateOneUser()
        {
            var body = UsersMock.CreateUserDTOMOck;
            var user = UsersMock.UserMock;
            this._repository.Setup(r => r.AddChangeAsync(user)).Returns(Task.CompletedTask);
            this._validations.Setup(v => v.ValidateDuplicated(body.Username)).Returns(Task.CompletedTask);
            this._validations.Setup(v => v.ValidateEmail(body.Email));
            this._validations.Setup(v => v.ValidatePassword(body.Password));

            var res = await this._service.CreateUser(body) as UsersModel;

            Assert.NotNull(res);
            Assert.Equal(user.Username, res.Username);
        }
        /// <summary>
        /// Delete a user
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldDeleteOneUser()
        {
            var id = 1;
            var user = UsersMock.UserMock;

            this._repository.Setup(r => r.FindByIdAsync(id)).ReturnsAsync(user);
            this._repository.Setup(r => r.RemoveAsync(It.IsAny<UsersModel>())).Returns(Task.CompletedTask);

            var res = this._service.DeleteUser(id);

            Assert.NotNull(res);
        }

        /// <summary>
        /// Remove Own Account
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldRemoveOwnAccount()
        {
            int id = 4;
            var body = UsersMock.PasswordDTODeletedMock;
            var user = UsersMock.UserHashPassMock;

            this._repository.Setup(r => r.FindByIdAsync(id)).ReturnsAsync(user);
            this._repository.Setup(r => r.RemoveAsync(user)).Returns(Task.CompletedTask);

            await this._service.RemoveOwnAccount(id, body);
        }

        /// <summary>
        /// Find on Key about a Value
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShoulFindByValue()
        {
            var user = UsersMock.UserMock;
            var key = "Username";
            var value = user.Username;

            this._repository.Setup(r => r.FindByKey(key, value)).ReturnsAsync(user);
            var res = await this._service.FindByAuth(key, value);

            Assert.NotNull(res);
            Assert.Equal(value, res.Username);
        }
        /// <summary>
        /// Get all Users
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldGetAllUser()
        {
            var list = new List<UsersModel> { UsersMock.UserMock };
            var response = new List<PublicUserDTO> { UsersMock.PublicUserDTOMOck };

            this._repository.Setup(r => r.ToListAsync()).ReturnsAsync(list);

            var res = await this._service.ToListAll();

            Assert.NotNull(res);
        }

        /// <summary>
        /// Get one user
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldGetOneUser()
        {
            var user = UsersMock.UserMock;
            var id = 4;
            this._repository.Setup(r => r.FindByIdAsync(id)).ReturnsAsync(user);
            var result = await this._service.GetById(id) as UsersModel;
            Assert.NotNull(result);
            Assert.Equal(user, result);
        }

        /// <summary>
        /// Find User by Id
        /// </summary>
        [Fact]
        public async Task ShouldReturnOneUserById()
        {
            int id = 4;
            var user = UsersMock.UserHashPassMock;
            var response = UsersMock.PublicUserDTOMOck;

            this._repository.Setup(r => r.FindByIdAsync(id)).ReturnsAsync(user);

            var res = await this._service.FindUserById(id);

            Assert.NotNull(res);
            Assert.Equal(response.Username, res.Username);
        }

        /// <summary>
        /// Update Token
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldUpdateToken()
        {
            int id = 4;
            string token = AuthMock.TokenMock.RefreshTokenHasher;

            var user = UsersMock.UserHashPassMock;

            this._repository.Setup(r => r.FindByIdAsync(id)).ReturnsAsync(user);
            this._repository.Setup(r => r.UpdateAsync(user)).ReturnsAsync(true);

            await this._service.UpdateToken(id, token);
        }

        /// <summary>
        /// Update a user
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldUpdateOneUser()
        {
            var body = UsersMock.UpdateUserDTOMOck;
            var user = UsersMock.UserWithBasicRolesMock;
            var id = 4;
            this._validations.Setup(v => v.ValidateDuplicated(body.Username)).Returns(Task.CompletedTask);
            this._repository.Setup(r => r.FindByIdAsync(id)).ReturnsAsync(user);
            this._repository.Setup(r => r.UpdateAsync(user)).ReturnsAsync(true);

            var res = await this._service.UpdateUser(id, body);

            Assert.NotNull(res);
            Assert.Equal(user, res);
        }

        /// <summary>
        /// Update own account
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldUpdateOwnAccount()
        {
            int id = 4;
            var body = UsersMock.UpdateOwnUserDTOMock;

            var user = UsersMock.UserHashPassMock;

            string message = "Your account was updated successfully";

            this._repository.Setup(r => r.FindByIdAsync(id)).ReturnsAsync(user);
            this._validations.Setup(v => v.ValidateDuplicated(body.Username)).Returns(Task.CompletedTask);
            this._repository.Setup(r => r.UpdateAsync(user)).ReturnsAsync(true);

            var res = await this._service.UpdateOwnUserAccount(id, body);

            Assert.NotNull(res);
            Assert.Equal(message, res);
        }

        /// <summary>
        /// Update Roles
        /// </summary>
        [Fact]
        public async Task ShouldUpdateRolesUserByAdminRols()
        {
            int id = 4;
            var body = UsersMock.RolesDTOMock;
            var user = UsersMock.UserHashPassMock;

            string message = $"The rols of user {user.Username} was chanches for {body.Roles} ";

            this._repository.Setup(r => r.FindByIdAsync(id)).ReturnsAsync(user);
            this._repository.Setup(r => r.UpdateAsync(user)).ReturnsAsync(true);

            var res = await this._service.UpdateRolesUser(id, body);

            Assert.NotNull(res);
            Assert.Equal(message, res);
        }

        /// <summary>
        /// Update Email
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldUpdateEmail()
        {
            int id = 4;
            var body = UsersMock.NewEmailDTOMock;
            var user = UsersMock.UserHashPassMock;

            this._repository.Setup(r => r.FindByIdAsync(id)).ReturnsAsync(user);
            this._validations.Setup(v => v.ValidateEmail(body.NewEmail)).Returns(Task.CompletedTask);
            this._repository.Setup(r => r.UpdateAsync(user)).ReturnsAsync(true);

            var res = await this._service.UpdateEmail(id, body);

            Assert.NotNull(res);
            Assert.Equal(body.NewEmail, res.Email);
        }

        /// <summary>
        /// Update Password
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task SouldUpdateOnePassword()
        {
            var id = 4;
            var user = UsersMock.UserHashPassMock;
            var mock = UsersMock.NewPasswordDTOMock;
            string message = "Password updated successfully";

            this._repository.Setup(r => r.FindByIdAsync(id)).ReturnsAsync(user);
            this._validations.Setup(v => v.ValidatePassword(mock.NewPassword));
            this._repository.Setup(r => r.UpdateAsync(user)).ReturnsAsync(true);

            var res = await this._service.UpdatePassword(id, mock);

            Assert.NotNull(res);
            Assert.Equal(message, res);
        }

        /// <summary>
        /// ForgetPassword
        /// </summary>
        [Fact]
        public async Task ShouldRetuenACodeOfVerification()
        {
            var body = UsersMock.ForgetDTOMock;
            var user = UsersMock.UserHashPassMock;

            string message = $"Hi {user.First_name} check your email to return your account";

            this._repository.Setup(r => r.FindByEmail(body.Email)).ReturnsAsync(user);
            this._repository.Setup(r => r.UpdateAsync(user)).ReturnsAsync(true);

            var res = await this._service.ForgetPassword(body);

            Assert.NotNull(res);
            Assert.Equal(message, res);
        }

        /// <summary>
        /// Recuperation Account
        /// </summary>
        [Fact]
        public async Task ShouldRecuperationAccount()
        {
            var body = UsersMock.RecuperationDTOMock;
            var user = UsersMock.UserHashPassMock;

            this._repository.Setup(r => r.FindByEmail(body.Email)).ReturnsAsync(user);
            this._validations.Setup(v => v.ValidatePassword(body.Password));
            this._repository.Setup(r => r.UpdateAsync(user)).ReturnsAsync(true);

            var res = await this._service.RecuperationAccount(body);

            Assert.NotNull(res);
            Assert.Equal(user.Username, res.Username);
        }

        /// <summary>
        /// Mark Verify
        /// </summary>
        [Fact]
        public async Task ShouldVerifyEmail()
        {
            var body = UsersMock.VerifyDTOMock;
            var user = UsersMock.UserMock;

            string message = $"Hi {user.First_name} {user.Last_name} your account was verify";

            this._repository.Setup(r => r.FindByEmail(body.Email)).ReturnsAsync(user);
            this._repository.Setup(r => r.UpdateAsync(user)).ReturnsAsync(true);

            var res = await this._service.MarkVerify(body);

            Assert.NotNull(res);
            Assert.Equal(message, res);
        }
    }
}
