using Moq;
using Microsoft.AspNetCore.Http;
using TASK_FLOW.NET.User.Service.Interface;
using TASK_FLOW.NET.Auth.JWT.Service.Interface;
using TASK_FLOW.NET.Auth.Cookie.Service.Interface;
using TASK_FLOW.NET.Auth.Service;
using TASK_FLOW.NET.User.Model;
using Specs.User.Mocks;
using Specs.Auth.Mock;
using System.Threading.Tasks;

namespace Specs.Auth
{
    public class InterAuth
    {
        private readonly Mock<IUserService> _userService;
        private readonly Mock<IHttpContextAccessor> _httpContext;
        private readonly Mock<ITokenService> _tokenService;
        private readonly Mock<ICookieService> _cookieService;
        private readonly AuthService _authService;

        public InterAuth()
        {
            this._userService = new Mock<IUserService>();
            this._httpContext = new Mock<IHttpContextAccessor>();
            this._tokenService = new Mock<ITokenService>();
            this._cookieService = new Mock<ICookieService>();

            this._httpContext.Setup(x => x.HttpContext).Returns(new DefaultHttpContext());

            this._authService = new AuthService(
                this._userService.Object,
                this._httpContext.Object,
                this._tokenService.Object,
                this._cookieService.Object
                );
        }
        /// <summary>
        /// Should Register a user
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldRegisterUser()
        {
            var body = UsersMock.CreateUserDTOMOck;
            var user = UsersMock.UserMock;
            string message = $"Hi {user.First_name} {user.Last_name} your account was register successfully, Now your need check your email to verify the account.//JUST FOR DEV Your code is {user.VerifyCode}";

            this._userService.Setup(u => u.CreateUser(body)).ReturnsAsync(user);

            var res = await this._authService.RegisterUser(body);

            Assert.NotNull(res);
            Assert.Equal(message, res);
        }

        // Generate Token 
        [Fact]
        public async Task GenerateToken_ShouldGenerateTokenAndSetCookie()
        {
            var user = UsersMock.UserMock;
            var token = AuthMock.TokenMock;

            string message = $"Welcome {user.Username}";
            this._tokenService.Setup(x => x.GenerateAuthenticationToken(user)).Returns(token);

            var result = await this._authService.GenerateToken(user);

            this._userService.Verify(x => x.UpdateToken(user.Id, token.RefreshTokenHasher), Times.Once);

            this._cookieService.Verify(x => x.SetTokenCookies(It.IsAny<HttpResponse>(), token), Times.Once);

            Assert.Equal(message, result);
        }

        [Fact]
        public async Task ShouldRefreshTheToken()
        {

            var user = UsersMock.UserMock;
            var token = AuthMock.TokenMock;

            this._tokenService.Setup(s => s.GetIdFromClaim()).Returns(user.Id);
            this._userService.Setup(s => s.GetById(user.Id)).ReturnsAsync(user);
            this._tokenService.Setup(s => s.GenerateRefreshToken(user)).Returns(token);

            var result = await this._authService.RefreshToken();

            this._userService.Verify(x => x.UpdateToken(user.Id, token.RefreshTokenHasher), Times.Once);

            this._cookieService.Verify(x => x.SetTokenCookies(It.IsAny<HttpResponse>(), token), Times.Once);

            Assert.Equal(token.AccessToken, result);
        }
        //Get the user from cookie
        [Fact]
        public async Task Should_Get_The_User_From_Cookie()
        {
            var user = UsersMock.UserMock;

            this._tokenService.Setup(t => t.GetIdFromClaim()).Returns(user.Id);
            this._userService.Setup(u => u.GetById(user.Id)).ReturnsAsync(user);

            var response = this._authService.GetUserByCookie();
            var result = Assert.IsType<UsersModel>(response.Result);

            Assert.Equal(user, result);
        }

        /// <summary>
        /// Log Out
        /// </summary>
        [Fact]
        public async Task ShouldCloseSection()
        {
            var user = UsersMock.UserHashPassMock;

            string message = "Your account was closet successfully";

            var httpContext = new DefaultHttpContext();

            this._httpContext.Setup(h => h.HttpContext).Returns(httpContext);
            this._tokenService.Setup(t => t.GetIdFromClaim()).Returns(user.Id);
            this._userService.Setup(u => u.GetById(user.Id)).ReturnsAsync(user);
            this._userService.Setup(u => u.UpdateToken(user.Id, string.Empty)).Returns(Task.CompletedTask);

            var res = await this._authService.Logout();

            Assert.NotNull(res);
            Assert.Equal(message, res);
        }
        /// <summary>
        /// Should Update Email
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldUpdateEmail()
        {
            int id = 4;
            var body = UsersMock.NewEmailDTOMock;
            var user = UsersMock.UserHashPassMock;

            string message = $"Your new Email was updated successfully. Check Your Email to validite the new Email";

            this._userService.Setup(u => u.UpdateEmail(id, body)).ReturnsAsync(user);
            this._userService.Setup(u => u.UpdateToken(user.Id, string.Empty)).Returns(Task.CompletedTask);

            var res = await this._authService.UpdateEmail(id, body);

            Assert.NotNull(res);
            Assert.Equal(message, res);
        }

        /// <summary>
        /// Remove own account
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldRemoveOwnAccount()
        {
            int id = 4;
            var body = UsersMock.PasswordDTODeletedMock;
            string message = "Your account was deleted successfully";

            this._userService.Setup(u => u.RemoveOwnAccount(id, body)).Returns(Task.CompletedTask);

            var res = await this._authService.RemoveOwnAccount(id, body);

            Assert.NotNull(res);
            Assert.Equal(message, res);
        }

        /// <summary>
        /// Verify Account
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldVerifyAccount()
        {
            var body = UsersMock.VerifyDTOMock;
            var user = UsersMock.UserMock;

            string message = $"Hi {user.First_name} {user.Last_name} your account was verify";

            this._userService.Setup(u => u.MarkVerify(body)).ReturnsAsync(message);

            var res = await this._authService.VerifyAccount(body);

            Assert.NotNull(res);
            Assert.Equal(message, res);
        }

        /// <summary>
        /// Validate Credentials
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task Should_Validate_the_User_Credentials()
        {
            var authProps = AuthMock.AuthDTOMock;
            var user = UsersMock.UserHashPassMock;

            this._userService.Setup(u => u.FindByAuth("Username", authProps.Username)).ReturnsAsync(user);

            var result = this._authService.ValidationUser(authProps);

            Assert.Equal(user, result.Result);
        }

        /// <summary>
        /// Forget Account
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldReturnAMessageWhenUserForgetHisPassword()
        {
            var body = UsersMock.ForgetDTOMock;
            var user = UsersMock.UserHashPassMock;

            string message = $"Hi {user.First_name} check your email to return your account";

            this._userService.Setup(u => u.ForgetPassword(body)).ReturnsAsync(message);

            var res = await this._authService.ForgetAccount(body);

            Assert.NotNull(res);
            Assert.Equal(message, res);
        }

        /// <summary>
        /// Recuperation Account
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldUpdatePasswordWhenUserSolictedTheRecuperation()
        {
            var body = UsersMock.RecuperationDTOMock;
            var user = UsersMock.UserHashPassMock;

            string message = $"Hi {user.First_name} your password was updated";

            this._userService.Setup(u => u.RecuperationAccount(body)).ReturnsAsync(user);

            var res = await this._authService.RecuperatioAccount(body);

            Assert.NotNull(res);
            Assert.Equal(message, res);
        }
    }
}
