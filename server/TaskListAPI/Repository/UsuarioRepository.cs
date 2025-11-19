using TaskListAPI.Model.Entities;
using TaskListAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace TaskListAPI.Repository
{
    public class UsuarioRepository : GenericRepository<Usuario>, IUsuarioRepository
    {
        public UsuarioRepository(TaskListDbContext context) : base(context) { }

        public async Task<Usuario> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task AddUserWithHashedPasswordAsync(Usuario user)
        {
         
            user.Senha = BCrypt.Net.BCrypt.HashPassword(user.Senha);
            user.CriadoEm = System.DateTime.UtcNow;
            await _dbSet.AddAsync(user);
            await _context.SaveChangesAsync();
        }

       
        public bool VerifyPassword(Usuario user, string providedPassword)
        {
            if (user == null || string.IsNullOrWhiteSpace(user.Senha))
            {
                return false;
            }

            return BCrypt.Net.BCrypt.Verify(providedPassword, user.Senha);
        }

        public async override Task UpdateAsync(Usuario user)
        {
            var existingUser = await GetByIdAsync(user.Id);

            if (existingUser != null)
            {
                existingUser.Nome = user.Nome;
                existingUser.Email = user.Email;
               
                _dbSet.Update(existingUser);
                await _context.SaveChangesAsync();
            }
        }
    }
}