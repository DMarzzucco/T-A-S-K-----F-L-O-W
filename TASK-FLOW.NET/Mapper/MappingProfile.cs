using AutoMapper;
using TASK_FLOW.NET.Project.DTO;
using TASK_FLOW.NET.Project.Model;
using TASK_FLOW.NET.Tasks.DTOs;
using TASK_FLOW.NET.Tasks.Model;
using TASK_FLOW.NET.User.DTO;
using TASK_FLOW.NET.User.Model;
using TASK_FLOW.NET.UserProject.DTO;
using TASK_FLOW.NET.UserProject.Model;

namespace TASK_FLOW.NET.Mapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //User Mapper
            CreateMap<CreateUserDTO, UsersModel>();
            CreateMap<UpdateUserDTO, UsersModel>();
            CreateMap<UpdateOwnUserDTO, UsersModel>()
                .ForMember(d => d.Password, op => op.Ignore());
            CreateMap<UsersModel, PublicUserDTO>();
            CreateMap<UsersModel, SimpleUserDTO>();
            // User Project Mapper
            CreateMap<UserProjectDTO, UserProjectModel>();
            CreateMap<UpdateUserProjectDTO, UserProjectModel>();

            CreateMap<UserProjectModel, SimpleProjectIncludeDTO>()
                .ForMember(dest => dest.RelationId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.ProjectId, opt => opt.MapFrom(src => src.Project.Id))
                .ForMember(dest => dest.ProjectName, opt => opt.MapFrom(src => src.Project.Name))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Project.Description))
                .ForMember(dest => dest.Tasks, opt => opt.MapFrom(src => src.Project.Tasks));

            CreateMap<UserProjectModel, SimpleUserDTO>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.User.Id))
                .ForMember(dest => dest.First_name, opt => opt.MapFrom(src => src.User.First_name))
                .ForMember(dest => dest.Last_name, opt => opt.MapFrom(src => src.User.Last_name))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.User.Age))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username));

            CreateMap<UserProjectModel, PublicUserProjectDTO>()
                .ForMember(dest => dest.Project, opt => opt.MapFrom(src => src.Project))
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User));

            //Project Mapper
            CreateMap<CreateProjectDTO, ProjectModel>();
            CreateMap<UpdateProjectDTO, ProjectModel>();
            CreateMap<ProjectModel, PublicProjectDTO>();
            CreateMap<ProjectModel, SimpleProjectIncludeDTObyUp>();
            //Task Mapper
            CreateMap<CreateTaskDTO, TaskModel>();
            CreateMap<UpdateTaskDTO, TaskModel>();
            CreateMap<TaskModel, SimpleTaskInclude>();
        }
    }
}
