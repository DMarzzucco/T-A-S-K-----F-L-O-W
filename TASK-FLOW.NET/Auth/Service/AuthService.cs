using TASK_FLOW.NET.Auth.DTO;
using TASK_FLOW.NET.Auth.Service.Interface;
using TASK_FLOW.NET.User.Model;
using TASK_FLOW.NET.User.Service.Interface;
using BCrypt.Net;
using Microsoft.AspNetCore.Identity;
using TASK_FLOW.NET.Auth.JWT.Service.Interface;
using TASK_FLOW.NET.Auth.Cookie.Service.Interface;
using TASK_FLOW.NET.User.DTO;
using TASK_FLOW.NET.Utils.Exceptions;
namespace TASK_FLOW.NET.Auth.Service
{
    public class AuthService : IAuthService
    {
        private readonly IUserService _userService;
        private readonly IHttpContextAccessor _httpContext;
        private readonly ITokenService _tokenService;
        private readonly ICookieService _cookieService;

        public AuthService(IUserService userService, IHttpContextAccessor httpContext, ITokenService tokenService, ICookieService cookieService)
        {
            this._userService = userService;
            this._httpContext = httpContext;
            this._tokenService = tokenService;
            this._cookieService = cookieService;
        }

        /// <summary>
        /// Register User
        /// </summary>
        /// <param name="body"></param>
        /// <returns></returns>
        /// <exception cref="BadRequestException"></exception>
        public async Task<string> RegisterUser(CreateUserDTO body)
        {
            if (body == null)
            {
                throw new BadRequestException($"{body} is required");
            }
            var user = await this._userService.CreateUser(body);

            return $"Hi {user.First_name} {user.Last_name} your account was register successfully, Now your need check your email to verify the account.//JUST FOR DEV Your code is {user.VerifyCode}";
        }
        /// <summary>
        /// Generate Token 
        /// </summary>
        /// <param name="body"></param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
        public async Task<string> GenerateToken(UsersModel body)
        {
            var context = this._httpContext.HttpContext ??
                throw new UnauthorizedAccessException("HttpContext is null");
                
            var token = this._tokenService.GenerateToken(body);
            await this._userService.UpdateToken(body.Id, token.RefreshTokenHasher);

            this._cookieService.SetTokenCookies(context.Response, token);
            return $"Welcome {body.Username}";
        }
        /// <summary>
        /// Refresh Token
        /// </summary>
        /// <returns></returns>
        public async Task<string> RefreshToken()
        {
            var context = this._httpContext.HttpContext;
            if (context == null) throw new UnauthorizedAccessException("HttpContext is null");

            var user = await this.GetUserByCookie();
            var token = this._tokenService.RefreshToken(user);

            await this._userService.UpdateToken(user.Id, token.RefreshTokenHasher);

            this._cookieService.SetTokenCookies(context.Response, token);
            return token.AccessToken;
        }
        /// <summary>
        /// Get Profile
        /// </summary>
        /// <returns></returns>
        public async Task<string> GetProfile()
        {
            var user = await this.GetUserByCookie();
            return $"this is {user.First_name} {user.Last_name}";
        }
        /// <summary>
        /// Get User By Cookie 
        /// </summary>
        /// <returns></returns>
        public async Task<UsersModel> GetUserByCookie()
        {
            var id = this._tokenService.GetIdFromToken();
            var user = await this._userService.GetById(id);
            return user;
        }
        /// <summary>
        /// Log Out 
        /// </summary>
        /// <returns></returns>
        public async Task<string> Logout()
        {
            var context = this._httpContext.HttpContext ??
                throw new UnauthorizedAccessException("HttpContext is null");

            int id = this._tokenService.GetIdFromToken();

            var user = await this._userService.GetById(id);

            await this._userService.UpdateToken(user.Id, string.Empty); 

            this._cookieService.ClearTokenCookies(context.Response);

            return "Your account was closet successfully";
        }
        /// <summary>
        /// Update Email
        /// </summary>
        /// <param name="id"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
        public async Task<string> UpdateEmail(int id, NewEmailDTO body)
        {
            var context = this._httpContext.HttpContext ??
                throw new UnauthorizedAccessException("Httpcontext is null");

            var user = await this._userService.UpdateEmail(id, body);
            await this._userService.UpdateToken(user.Id, string.Empty);

            this._cookieService.ClearTokenCookies(context.Response);

            return $"Your new Email was updated successfully. Check Your Email to validite the new Email";
        }
        /// <summary>
        /// Remove own account
        /// </summary>
        /// <param name="id"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
        public async Task<string> RemoveOwnAccount(int id, PasswordDTO body)
        {
            var context = this._httpContext.HttpContext ??
                throw new UnauthorizedAccessException("Httpcontext is null");

            await this._userService.RemoveOwnAccount(id, body);

            this._cookieService.ClearTokenCookies(context.Response);

            return "Your account was deleted successfully";
        }
        /// <summary>
        /// Refresh Token Validate 
        /// </summary>
        /// <param name="refreshToken"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
        public async Task<UsersModel> RefreshTokenValidate(string refreshToken, int id)
        {
            var user = await this._userService.GetById(id);

            var match = BCrypt.Net.BCrypt.Equals(refreshToken, user.RefreshToken);
            if (!match) throw new UnauthorizedAccessException();

            return user;
        }
        /// <summary>
        ///  Validate User
        /// </summary>
        /// <param name="body"></param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
        public async Task<UsersModel> ValidationUser(AuthPropsDTO body)
        {
            var user = await this._userService.FindByAuth("Username", body.Username);
            var passwordHasher = new PasswordHasher<UsersModel>();

            var verificationResult = passwordHasher.VerifyHashedPassword(user, user.Password, body.Password);

            if (verificationResult == PasswordVerificationResult.Failed) throw new UnauthorizedAccessException("Password wrong");

            if (user.VerifyEmail == false)
                throw new ForbiddentExceptions("Your account not was verifiet");

            return user;
        }

        /// <summary>
        /// Verify Email 
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public async Task<string> VerifyAccount(VerifyDTO dto)
        {
            var response = await this._userService.MarkVerify(dto);
            return response;
        }

        /// <summary>
        /// Forget password
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public async Task<string> ForgetAccount(ForgetDTO dto)
        {
            var response = await this._userService.ForgetPassword(dto);
            return response;
        }

        /// <summary>
        /// Recuperation Account 
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public async Task<string> RecuperatioAccount(RecuperationDTO dto)
        {
            var res = await this._userService.RecuperationAccount(dto);

            return $"Hi {res.First_name} your password was updated";
        }
    }
}
