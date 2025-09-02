using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Specs.Auth.Mock;
using TASK_FLOW.NET.Auth.Controller;
using TASK_FLOW.NET.Auth.Service.Interface;
using Specs.User.Mocks;
using System.Threading.Tasks;

namespace Specs.Auth
{
    public class UnitAuth
    {
        private readonly Mock<IAuthService> _service;
        private readonly AuthController _controller;

        public UnitAuth()
        {
            this._service = new Mock<IAuthService>();
            this._controller = new AuthController(this._service.Object);
        }

        /// <summary>
        /// 200 Register User
        /// </summary>
        [Fact]
        public async Task ShouldRegisterUser()
        {
            var body = UsersMock.CreateUserDTOMOck;
            var user = UsersMock.UserMock;

            string message = $"Hi {user.First_name} {user.Last_name} your account was register successfully, Now your need check your email to verify the account.//JUST FOR DEV Your code is {user.VerifyCode}";

            this._service.Setup(s => s.RegisterUser(body)).ReturnsAsync(message);

            var res = await this._controller.RegisterUser(body);
            var result = Assert.IsType<OkObjectResult>(res.Result);

            Assert.NotNull(res);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(message, result.Value);
        }
        /// <summary>
        /// Login 
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldReturnTokenWhenUserIsValid()
        {
            var authProps = AuthMock.AuthDTOMock;
            var user = UsersMock.UserMock;

            var token = AuthMock.TokenMock.AccessToken;

            var httpContext = new DefaultHttpContext();
            httpContext.Items["User"] = user;

            this._controller.ControllerContext.HttpContext = httpContext;
            this._service.Setup(s => s.GenerateToken(user)).ReturnsAsync(token);

            var result = await this._controller.Login(authProps) as ObjectResult;

            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status200OK, result.StatusCode);
        }

        /// <summary>
        /// Logout
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldLogOutSection()
        {
            string message = "Your account was closet successfully";

            this._service.Setup(s => s.Logout()).ReturnsAsync(message);

            var result = await this._controller.LogOut();
            var res = Assert.IsType<OkObjectResult>(result.Result);

            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status200OK, res.StatusCode);
        }
        /// <summary>
        /// Refresh Token 
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldRefreshToken()
        {
            var token = AuthMock.TokenMock;

            this._service.Setup(s => s.RefreshToken()).ReturnsAsync(token.AccessToken);

            var result = await this._controller.RefreshToken() as ObjectResult;

            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status200OK, result.StatusCode);
        }

        /// <summary>
        /// UpdateEmail
        /// </summary>
        [Fact]
        public async Task ShouldUpdateEmail()
        {
            int id = 4;
            var body = UsersMock.NewEmailDTOMock;
            var user = UsersMock.UserHashPassMock;

            string message = $"Your new Email was updated successfully. Check Your Email to validite the new Email";

            this._service.Setup(s => s.UpdateEmail(id, body)).ReturnsAsync(message);

            var res = await this._controller.UpdateEmail(id, body);
            var result = Assert.IsType<OkObjectResult>(res.Result);

            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(message, result.Value);
        }

        /// <summary>
        /// Should Remove Own Account
        /// </summary>
        [Fact]
        public async Task ShouldRemoveOwnAccount()
        {
            int id = 4;
            var body = UsersMock.PasswordDTODeletedMock;
            string message = "Your account was deleted successfully";

            this._service.Setup(s => s.RemoveOwnAccount(id, body)).ReturnsAsync(message);

            var r = await this._controller.RemoveOwnAccount(id, body);
            var res = Assert.IsType<OkObjectResult>(r.Result);

            Assert.NotNull(res);
            Assert.Equal(200, res.StatusCode);
            Assert.Equal(message, res.Value);
        }
        /// <summary>
        /// Verify Account
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldVerifyAccount200()
        {
            var body = UsersMock.VerifyDTOMock;
            var user = UsersMock.UserMock;

            string message = $"Hi {user.First_name} {user.Last_name} your account was verify";

            this._service.Setup(s => s.VerifyAccount(body)).ReturnsAsync(message);

            var r = await this._controller.VerifyEmailAccount(body);
            var res = Assert.IsType<OkObjectResult>(r.Result);

            Assert.NotNull(res);
            Assert.Equal(200, res.StatusCode);
            Assert.Equal(message, res.Value);
        }
        /// <summary>
        /// Forget Password 200
        /// </summary>
        [Fact]
        public async Task ShouldReturn200WhenUserForgetHisPassword()
        {
            var body = UsersMock.ForgetDTOMock;
            var user = UsersMock.UserHashPassMock;

            string message = $"Hi {user.First_name} check your email to return your account";

            this._service.Setup(s => s.ForgetAccount(body)).ReturnsAsync(message);

            var res = await this._controller.ForgetAccount(body);
            var result = Assert.IsType<OkObjectResult>(res.Result);

            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(message, result.Value);
        }
        /// <summary>
        /// Recuperation account
        /// </summary>
        [Fact]
        public async Task ShouldReturn200WhenUserUpdateHisPassword()
        {
            var body = UsersMock.RecuperationDTOMock;
            var user = UsersMock.UserHashPassMock;

            string message = $"Hi {user.First_name} your password was updated";

            this._service.Setup(s => s.RecuperatioAccount(body)).ReturnsAsync(message);

            var res = await this._controller.RecuperationAccount(body);
            var result = Assert.IsType<OkObjectResult>(res.Result);

            Assert.NotNull(res);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(message, result.Value);
        }
    }
}