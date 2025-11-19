using Microsoft.AspNetCore.Mvc;
using TaskListAPI.Model.Entities;
using TaskListAPI.Repository;

namespace TaskListAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioRepository _repository;

        public UsuarioController(IUsuarioRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            return Ok(await _repository.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            var usuario = await _repository.GetByIdAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            return Ok(usuario);
        }

        [HttpPost]
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
        {
            await _repository.AddUserWithHashedPasswordAsync(usuario);
            usuario.Senha = null;
            return CreatedAtAction(nameof(GetUsuario), new { id = usuario.Id }, usuario);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(int id, Usuario usuario)
        {
            if (id != usuario.Id)
            {
                return BadRequest();
            }

            var existingUser = await _repository.GetByIdAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            existingUser.Nome = usuario.Nome;
            existingUser.Email = usuario.Email;

            await _repository.UpdateAsync(existingUser);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}