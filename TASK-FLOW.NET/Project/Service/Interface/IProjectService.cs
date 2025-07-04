using TASK_FLOW.NET.Project.DTO;
using TASK_FLOW.NET.Project.Model;

namespace TASK_FLOW.NET.Project.Service.Interface
{
    public interface IProjectService
    {
        Task<string> SaveProject(CreateProjectDTO body);
        Task<IEnumerable<ProjectModel>> ListOfProject();
        Task<ProjectModel> GetProjectById(int id);
        Task<ProjectModel> UpdateProject(int id, UpdateProjectDTO body);
        Task DeleteProject(int id);
        Task<PublicProjectDTO> FindProjectById(int id);
    }
}
