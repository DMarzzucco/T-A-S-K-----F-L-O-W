﻿using AutoMapper;
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
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            //User Mapper
            CreateMap<CreateUserDTO, UsersModel>();
            CreateMap<UpdateUserDTO, UsersModel>();
            // User Project Mapper
            CreateMap<UserProjectDTO, UserProjectModel>();
            CreateMap<UpdateUserProjectDTO, UserProjectModel>();
            //Project Mapper
            CreateMap<CreateProjectDTO, ProjectModel>();
            CreateMap<UpdateProjectDTO, ProjectModel>();
            //Task Mapper
            CreateMap<CreateTaskDTO, TaskModel>();
            CreateMap<UpdateTaskDTO, TaskModel>();
        }
    }
}
