using Microsoft.AspNetCore.Mvc;
using Moq;
using Specs.Project.Mock;
using Specs.User.Mocks;
using TASK_FLOW.NET.Project.Controller;
using TASK_FLOW.NET.Project.Model;
using TASK_FLOW.NET.Project.Service.Interface;
using TASK_FLOW.NET.UserProject.Enums;
using TASK_FLOW.NET.UserProject.Model;

namespace Specs.Project
{
    public class UnitProjectTest1
    {
        private readonly Mock<IProjectService> _projectService;
        private readonly ProjectController _projectController;

        public UnitProjectTest1()
        {
            this._projectService = new Mock<IProjectService>();
            this._projectController = new ProjectController(this._projectService.Object);
        }

        /// <summary>
        /// Create project
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task Should_Create_A_Project()
        {
            var body = ProjectMock.CreateProjectDTOMock;
            var project = ProjectMock.ProjectModelMock;

            var user = UsersMock.UserMock;

            var userProject = new UserProjectModel
            {
                AccessLevel = ACCESSLEVEL.OWNER,
                User = user,
                Project = project
            };

            string message = $"Your Project {project.Name} was create by {user.Username}. And your access level is: {userProject.AccessLevel}";

            this._projectService.Setup(s => s.SaveProject(body)).ReturnsAsync(message);

            var res = await this._projectController.CreateProject(body);
            var result = Assert.IsType<OkObjectResult>(res.Result);

            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(message, result.Value);
        }

        /// <summary>
        /// Get all Project
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task GetAllProject_ShouldReturnOkWithProjects()
        {
            var listProjects = new List<ProjectModel>
            {
                new ProjectModel
            {
                Id = 4,
                Name = "Project test",
                Description = "This is a project test"
            },
                new ProjectModel
            {
                Id = 4,
                Name = "Project test",
                Description = "This is a project test"
            }
            };

            this._projectService.Setup(p => p.ListOfProject()).ReturnsAsync(listProjects);

            var res = await this._projectController.GetAllProject();
            var result = Assert.IsType<OkObjectResult>(res.Result);

            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(listProjects, result.Value);
        }

        /// <summary>
        /// Get a project according his id
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task Get_A_Project_By_His_Id()
        {
            var project = ProjectMock.PublicProjectDTOMock;

            int id = 4;

            this._projectService.Setup(p => p.FindProjectById(id)).ReturnsAsync(project);

            var res = await this._projectController.GetProjectById(id);
            var result = Assert.IsType<OkObjectResult>(res.Result);

            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(project, result.Value);
        }

        /// <summary>
        /// Update Project
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task Should_Update_Project()
        {
            var body = ProjectMock.UpdateProjectDTOMock;
            var project = ProjectMock.ProjectModelMock;

            var projectId = 4;
            this._projectService.Setup(p => p.UpdateProject(projectId, body)).ReturnsAsync(project);

            var res = await this._projectController.UpdateProject(projectId, body);
            var result = Assert.IsType<NoContentResult>(res.Result);

            Assert.NotNull(result);
            Assert.Equal(204, result.StatusCode);
        }

        /// <summary>
        /// Delete Project
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task Should_Delte_A_PRoject()
        {
            var projectId = 4;

            this._projectService.Setup(p => p.DeleteProject(projectId)).Returns(Task.CompletedTask);

            var res = await this._projectController.DeleteProject(projectId);
            var result = Assert.IsType<NoContentResult>(res);

            Assert.NotNull(result);
            Assert.Equal(204, result.StatusCode);
        }
    }
}