using TaskListAPI.Model.Entities;

namespace TaskListAPI.Repository
{
    public interface IUsuarioRepository : IGenericRepository<Usuario>
    {
        Task<Usuario> GetByEmailAsync(string email);

        Task AddUserWithHashedPasswordAsync(Usuario user);

        bool VerifyPassword(Usuario user, string providedPassword);
    }
}