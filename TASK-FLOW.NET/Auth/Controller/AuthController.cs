using Microsoft.AspNetCore.Mvc;
using TASK_FLOW.NET.Auth.Attributes;
using TASK_FLOW.NET.Auth.DTO;
using TASK_FLOW.NET.Auth.Filters;
using TASK_FLOW.NET.Auth.Service.Interface;
using TASK_FLOW.NET.User.DTO;
using TASK_FLOW.NET.User.Enums;
using TASK_FLOW.NET.User.Model;

namespace TASK_FLOW.NET.Auth.Controller
{
    [Route("api/[controller]")]
    [JwtAuth]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;

        public AuthController(IAuthService service)
        {
            this._service = service;
        }

        /// <summary>
        /// Register a new User
        /// </summary>
        /// <param name="body"></param>
        /// <returns>A new User registered</returns>
        /// <response code="201">User Registered</response>
        /// <response code="409">Conflict between repeat dates</response>
        [AllowAnonymousAccess]
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<UsersModel>> RegisterUser([FromBody] CreateUserDTO body)
        {
            var user = await this._service.RegisterUser(body);
            return Ok(user);
        }
        /// <summary>
        /// Verify Email Address
        /// </summary>
        /// <param name="body"></param>
        /// <returns></returns>
        [AllowAnonymousAccess]
        [HttpPut("verify-account")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<string>> VerifyEmailAccount([FromBody] VerifyDTO body)
        {
            return Ok(await this._service.VerifyAccount(body));
        }

        /// <summary>
        /// Recuperation Account
        /// </summary>
        /// <param name="body"></param>
        /// <returns></returns>
        [AllowAnonymousAccess]
        [HttpPatch("recuperation-account")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
        public async Task<ActionResult<string>> RecuperationAccount([FromBody] RecuperationDTO body)
        {
            return Ok(await this._service.RecuperatioAccount(body));
        }

        /// <summary>
        /// Forget Account
        /// </summary>
        /// <param name="body"></param>
        /// <returns></returns>
        [AllowAnonymousAccess]
        [HttpPut("forget-account")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
        public async Task<ActionResult<string>> ForgetAccount([FromBody] ForgetDTO body)
        {
            return Ok(await this._service.ForgetAccount(body));
        }

        /// <summary>
        /// Login User 
        /// </summary>
        /// <param name="body"></param>
        /// <returns>User Token</returns>
        /// <response code="200">Ok</response>
        /// <response code="401">Unauthorized</response>
        [AllowAnonymousAccess]
        [ServiceFilter(typeof(LocalAuthFilter))]
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> Login([FromBody] AuthPropsDTO body)
        {
            var user = HttpContext.Items["User"] as UsersModel;
            var response = await this._service.GenerateToken(user);

            return Ok(response);
        }

        /// <summary>
        /// Get Profile
        /// </summary>
        /// <returns>Return the Username of User</returns>
        /// <response code="200">Ok</response>
        /// <response code="401">Unauthorized</response>
        [HttpGet("profile")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<string>> GetProfile()
        {
            var user = await this._service.GetProfile();
            return Ok(user);
        }

        /// <summary>
        /// Log Out
        /// </summary>
        /// <returns>200</returns>
        /// <response code="200">Ok</response>
        /// <response code="401">Unauthorized</response>
        [HttpPost("logout")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<string>> LogOut()
        {
            return Ok(await this._service.Logout());
        }
        /// <summary>
        /// Update Email
        /// </summary>
        /// <param name="id"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        [Roles(ROLES.BASIC)]
        [HttpPatch("update-email")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<string>> UpdateEmail(int id, [FromBody] NewEmailDTO body)
        {
            return Ok(await this._service.UpdateEmail(id, body));
        }
        /// <summary>
        /// Remove own account
        /// </summary>
        /// <param name="id"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        [Roles(ROLES.BASIC)]
        [HttpDelete("remove-own-account")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<string>> RemoveOwnAccount(int id, [FromBody] PasswordDTO body)
        {
            return Ok(await this._service.RemoveOwnAccount(id, body));
        }

        /// <summary>
        /// Refresh Token
        /// </summary>
        /// <returns>200</returns>
        /// <response code = "200">Ok</response>
        /// <response code = "401">Unauthorized</response>
        [HttpPost("refresh")]
        public async Task<ActionResult> RefreshToken()
        {
            var newToken = await this._service.RefreshToken();

            return StatusCode(StatusCodes.Status200OK, new { token = newToken });
        }
    }
}
