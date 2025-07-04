using Microsoft.AspNetCore.Mvc;
using TASK_FLOW.NET.Auth.Attributes;
using TASK_FLOW.NET.User.Enums;
using TASK_FLOW.NET.UserProject.DTO;
using TASK_FLOW.NET.UserProject.Model;
using TASK_FLOW.NET.UserProject.Services.Interface;

namespace TASK_FLOW.NET.UserProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProjectController : ControllerBase
    {
        private readonly IUserProjectService _service;

        public UserProjectController(IUserProjectService service)
        {
            _service = service;
        }

        /// <summary>
        /// Relation Project
        /// </summary>
        /// <returns>Relation between a User and a Project with a Access Level</returns>
        /// <response code="200">Relation finished successfully</response>
        /// <response code="400">Relation Faild</response>
        [Roles(ROLES.CREATOR)]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> RegisterUserAndProject([FromBody] UserProjectDTO body)
        {
            var data = await _service.CreateUP(body);
            return Ok(data);
        }
        /// <summary>
        /// Get All relations
        /// </summary>
        /// <returns></returns>
        [Roles(ROLES.CREATOR)]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserProjectModel>>> GetALLUP()
        {
            return Ok(await _service.ListOfAllUP());
        }

        /// <summary>
        /// Get One relation
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Roles(ROLES.CREATOR)]
        [HttpGet("{id}")]
        public async Task<ActionResult<PublicUserProjectDTO>> GetUPbyId(int id)
        {
            return Ok(await _service.GetUPbyID(id));
        }

        /// <summary>
        /// Update own relatin
        /// </summary>
        /// <param name="id"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        [Roles(ROLES.CREATOR)]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUP(int id, [FromBody] UpdateUserProjectDTO body)
        {
            var up = await _service.UpdateUP(id, body);
            return NoContent();
        }
    }
}
