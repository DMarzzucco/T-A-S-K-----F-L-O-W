using Microsoft.AspNetCore.Mvc;
using TASK_FLOW.NET.Auth.Attributes;
using TASK_FLOW.NET.User.DTO;
using TASK_FLOW.NET.User.Enums;
using TASK_FLOW.NET.User.Model;
using TASK_FLOW.NET.User.Service.Interface;

namespace TASK_FLOW.NET.User.Controller
{
    [Route("api/[controller]")]
    [JwtAuth]
    [AuthRoles]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;

        public UserController(IUserService service)
        {
            this._service = service;
        }

        /// <summary>
        /// Get All User
        /// </summary>
        /// <returns>A List of All Users</returns>
        /// <response code="200">List of User</response>
        /// <response code="400">Bad Request</response>
        [Roles(ROLES.CREATOR)]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<PublicUserDTO>>> GetAllUser()
        {
            return Ok(await this._service.ToListAll());
        }

        /// <summary>
        /// Get User by Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Get a user according his Id</returns>
        /// <response code="200">User</response>
        /// <response code="404">User not Found</response>
        [Roles(ROLES.BASIC)]
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PublicUserDTO>> GetUserById(int id)
        {
            var user = await this._service.FindUserById(id);
            return Ok(user);
        }

        /// <summary>
        /// Update User for creators roles
        /// </summary>
        /// <param name="id"></param>
        /// <param name="body"></param>
        /// <returns>Update a user according his id </returns>
        /// <response code="204">User Updated</response>
        /// <response code="404">User not found</response>
        [Roles(ROLES.CREATOR)]
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDTO body)
        {
            await this._service.UpdateUser(id, body);
            return NoContent();
        }

        /// <summary>
        /// Update own account
        /// </summary>
        /// <param name="id"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        [Roles(ROLES.BASIC)]
        [HttpPut("edit@account/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<string>> UpdateOwnAccount(int id, [FromBody] UpdateOwnUserDTO body)
        {
            return Ok(await this._service.UpdateOwnUserAccount(id, body));
        }

        /// <summary>
        /// Update Password
        /// </summary>
        /// <param name="id"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        [Roles(ROLES.BASIC)]
        [HttpPatch("{id}/password")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<string>> UpdatePasswordUser(int id, [FromBody] NewPasswordDTO body)
        {
            return Ok(await this._service.UpdatePassword(id, body));
        }

        /// <summary>
        /// Update Roles
        /// </summary>
        /// <param name="id"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        [Roles(ROLES.ADMIN)]
        [HttpPatch("{id}/update-roles")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<string>> UpdateRoles(int id, [FromBody] RolesDTO body)
        {
            return Ok(await this._service.UpdateRolesUser(id, body));
        }
        /// <summary>
        /// Delte User
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Delete a User according his Id</returns>
        /// <response code="204">User Deleted</response>
        /// <response code="404">User Not Found</response>
        [Roles(ROLES.CREATOR)]
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DelteUser(int id)
        {
            await this._service.DeleteUser(id);
            return NoContent();
        }


    }
}
