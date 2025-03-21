﻿using TASK_FLOW.NET.Auth.DTO;
using TASK_FLOW.NET.Auth.Service.Interface;
using TASK_FLOW.NET.User.Model;
using TASK_FLOW.NET.User.Service.Interface;
using BCrypt.Net;
using Microsoft.AspNetCore.Identity;
using TASK_FLOW.NET.Auth.JWT.Service.Interface;
using TASK_FLOW.NET.Auth.Cookie.Service.Interface;
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
        /// Generate Token 
        /// </summary>
        /// <param name="body"></param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
        public async Task<string> GenerateToken(UsersModel body)
        {
            var context = this._httpContext.HttpContext;
            if (context == null) throw new UnauthorizedAccessException("HttpContext is null");

            var token = this._tokenService.GenerateToken(body);
            await this._userService.UpdateToken(body.Id, token.RefreshTokenHasher);

            this._cookieService.SetTokenCookies(context.Response, token);
            return token.AccessToken;
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
            return user.Username;
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
        public async Task Logout()
        {
            var context = this._httpContext.HttpContext;
            if (context == null) throw new UnauthorizedAccessException("HttpContext is null");

            var user = await this.GetUserByCookie();
            await this._userService.UpdateToken(user.Id, string.Empty); 

            this._cookieService.ClearTokenCookies(context.Response);
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

            return user;
        }
    }
}
