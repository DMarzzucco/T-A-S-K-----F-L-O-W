using AutoMapper;
using Moq;
using Specs.Project.Mock;
using Specs.User.Mocks;
using Specs.UserProject.Mocks;
using TASK_FLOW.NET.Project.DTO;
using TASK_FLOW.NET.Project.Model;
using TASK_FLOW.NET.Project.Repository.Interface;
using TASK_FLOW.NET.User.DTO;
using TASK_FLOW.NET.User.Model;
using TASK_FLOW.NET.User.Repository.Interface;
using TASK_FLOW.NET.UserProject.DTO;
using TASK_FLOW.NET.UserProject.Model;
using TASK_FLOW.NET.UserProject.Repository.Interface;
using TASK_FLOW.NET.UserProject.Services;

namespace Specs.UserProject
{
    public class InterUserProjectTest
    {
        private readonly Mock<IUserProjectRepository> _repository;
        private readonly Mock<IProjectRepository> _projectRepository;
        private readonly Mock<IUserRepository> _userRepository;

        private readonly IMapper _mapper;
        private readonly UserProjectService _service;

        public InterUserProjectTest()
        {
            this._repository = new Mock<IUserProjectRepository>();
            this._projectRepository = new Mock<IProjectRepository>();
            this._userRepository = new Mock<IUserRepository>();

            var config = new MapperConfiguration(conf =>
            {
                conf.CreateMap<UsersModel, SimpleUserDTO>();

                conf.CreateMap<UserProjectDTO, UserProjectModel>();
                conf.CreateMap<UpdateUserProjectDTO, UserProjectModel>();

                conf.CreateMap<UserProjectModel, SimpleProjectIncludeDTO>()
                    .ForMember(dest => dest.RelationId, opt => opt.MapFrom(src => src.Id))
                    .ForMember(dest => dest.ProjectId, opt => opt.MapFrom(src => src.Project.Id))
                    .ForMember(dest => dest.ProjectName, opt => opt.MapFrom(src => src.Project.Name))
                    .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Project.Description))
                    .ForMember(dest => dest.Tasks, opt => opt.MapFrom(src => src.Project.Tasks));

                conf.CreateMap<UserProjectModel, SimpleUserDTO>()
                    .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.User.Id))
                    .ForMember(dest => dest.First_name, opt => opt.MapFrom(src => src.User.First_name))
                    .ForMember(dest => dest.Last_name, opt => opt.MapFrom(src => src.User.Last_name))
                    .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.User.Age))
                    .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                    .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username));

                conf.CreateMap<UserProjectModel, PublicUserProjectDTO>()
                    .ForMember(dest => dest.Project, opt => opt.MapFrom(src => src.Project))
                    .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User));

                conf.CreateMap<ProjectModel, SimpleProjectIncludeDTObyUp>();
            });
            this._mapper = config.CreateMapper();

            this._service = new UserProjectService(
                this._repository.Object,
                this._mapper,
                this._projectRepository.Object,
                this._userRepository.Object
                );
        }
        /// <summary>
        /// Create Relation UserProject
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldCreateOneRelationBetweenAUserWithAProject()
        {
            var body = UserProjectsMocks.CreateUserProjectDTOMOck;
            var project = ProjectMock.ProjectModelMock;
            var user = UsersMock.UserMock;

            this._projectRepository.Setup(p => p.findByIdAsync(body.ProjectId)).ReturnsAsync(project);
            this._userRepository.Setup(p => p.FindByIdAsync(body.UserId)).ReturnsAsync(user);
            var up = UserProjectsMocks.MockUserProject;

            this._repository.Setup(r => r.AddChangeAsync(up)).ReturnsAsync(true);

            var res = await this._service.CreateUP(body) as UserProjectModel;

            Assert.NotNull(res);
            Assert.Equal(project, res.Project);
            Assert.Equal(user, res.User);
        }

        /// <summary>
        /// List of All UserProject
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldGetOneListOfALlRegisterOfUserProject()
        {
            var list = new List<UserProjectModel> {
                UserProjectsMocks.MockUserProject,
                UserProjectsMocks.MockUserProject,
            };
            this._repository.Setup(r => r.ListofAllAsync()).ReturnsAsync(list);
            var res = await this._service.ListOfAllUP() as IEnumerable<UserProjectModel>;

            Assert.NotNull(res);
            Assert.Equal(list, res);
        }

        /// <summary>
        /// Get One Register of User Project 
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldGetOneRegisterOfUserProject()
        {
            var up = UserProjectsMocks.MockUserProject;
            var response = UserProjectsMocks.PublicUserProjectDTOMock;
            var id = 1;
            this._repository.Setup(r => r.findById(id)).ReturnsAsync(up);

            var res = await this._service.GetUPbyID(id);

            Assert.NotNull(res);
            Assert.Equal(up.Id, res.Id);
        }

        /// <summary>
        /// Edit one Register of User Project
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task ShouldEditTheRelationUserProject()
        {
            var body = UserProjectsMocks.UpdateUserProjectDTOMOck;
            var up = UserProjectsMocks.MockUserProject;
            var id = 1;

            this._repository.Setup(r => r.findById(id)).ReturnsAsync(up);
            this._repository.Setup(r => r.UpdateUPAsync(up)).ReturnsAsync(true);

            var res = await this._service.UpdateUP(id, body) as UserProjectModel;

            Assert.NotNull(res);
            Assert.Equal(up.Id, res.Id);
            Assert.Equal(up, res);
        }
    }
}
