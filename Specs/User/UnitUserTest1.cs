using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Specs.User.Mocks;
using TASK_FLOW.NET.User.Controller;
using TASK_FLOW.NET.User.DTO;
using TASK_FLOW.NET.User.Model;
using TASK_FLOW.NET.User.Service.Interface;

namespace Specs.User
{
    public class UnitUserTest1
    {
        private readonly Mock<IUserService> _service;
        private readonly UserController _controller;

        public UnitUserTest1()
        {
            this._service = new Mock<IUserService>();
            this._controller = new UserController(this._service.Object);
        }

        /// <summary>
        /// Get all User Register
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldGetAllUserRegister()
        {
            var list = new List<PublicUserDTO> { UsersMock.PublicUserDTOMOck };
            this._service.Setup(s => s.ToListAll()).ReturnsAsync(list);
            var res = await this._controller.GetAllUser();
            var result = Assert.IsType<OkObjectResult>(res.Result);

            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(list, result.Value);
        }
        /// <summary>
        /// Get one User Register 
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldGetOneUserRegister()
        {
            var user = UsersMock.PublicUserDTOMOck;
            var id = 4;

            this._service.Setup(s => s.FindUserById(id)).ReturnsAsync(user);

            var res = await this._controller.GetUserById(id);
            var result = Assert.IsType<OkObjectResult>(res.Result);

            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(user, result.Value);
        }
        /// <summary>
        /// Update one User Register
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldUpdateOneUserRegister()
        {
            var body = UsersMock.UpdateUserDTOMOck;
            var id = 4;
            var user = UsersMock.UserMock;

            this._service.Setup(s => s.UpdateUser(id, body)).ReturnsAsync(user);

            var res = await this._controller.UpdateUser(id, body) as NoContentResult;

            Assert.NotNull(res);
            Assert.Equal(204, res.StatusCode);
        }
        /// <summary>
        /// UpdateOwnAccount
        /// </summary>
        [Fact]
        public async Task ShouldUpdateOwnUserAccount()
        {
            int id = 4;
            var body = UsersMock.UpdateOwnUserDTOMock;

            var user = UsersMock.UserHashPassMock;

            string message = "Your account was updated successfully";

            this._service.Setup(s => s.UpdateOwnUserAccount(id, body)).ReturnsAsync(message);

            var r = await this._controller.UpdateOwnAccount(id, body);
            var res = Assert.IsType<OkObjectResult>(r.Result);

            Assert.NotNull(res);
            Assert.Equal(200, res.StatusCode);
            Assert.Equal(message, res.Value);
        }

        /// <summary>
        /// Update Roles
        /// </summary>
        [Fact]
        public async Task ShouldUpdateUserRoles()
        {
            int id = 4;
            var body = UsersMock.RolesDTOMock;
            var user = UsersMock.UserHashPassMock;

            string message = $"The rols of user {user.Username} was chanches for {body.Roles} ";

            this._service.Setup(s => s.UpdateRolesUser(id, body)).ReturnsAsync(message);

            var r = await this._controller.UpdateRoles(id, body);
            var res = Assert.IsType<OkObjectResult>(r.Result);

            Assert.NotNull(res);
            Assert.Equal(200, res.StatusCode);
            Assert.Equal(message, res.Value);
        }

        /// <summary>
        /// Should Update User Password
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldUpdateOnePassword()
        {
            var id = 4;
            var body = UsersMock.NewPasswordDTOMock;
            string message = "Password updated successfully";

            this._service.Setup(s => s.UpdatePassword(id, body)).ReturnsAsync(message);

            var res = await this._controller.UpdatePasswordUser(id, body);
            var result = Assert.IsType<OkObjectResult>(res.Result);

            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(message, result.Value);
        }
        /// <summary>
        /// Delete one user register
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldDeleteOneUserRegister()
        {
            var id = 4;
            this._service.Setup(s => s.DeleteUser(id)).Returns(Task.CompletedTask);

            var res = await this._controller.DelteUser(id) as NoContentResult;

            Assert.NotNull(res);
            Assert.Equal(204, res.StatusCode);
        }
    }
}