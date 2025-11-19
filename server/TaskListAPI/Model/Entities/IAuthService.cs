using TaskListAPI.Model.Entities;

namespace TaskListAPI.Services
{
    public interface IAuthService
    {
        string GenerateJwtToken(Usuario user);
    }
}