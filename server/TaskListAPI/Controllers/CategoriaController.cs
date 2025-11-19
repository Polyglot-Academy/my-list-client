using Microsoft.AspNetCore.Mvc;
using TaskListAPI.Model.Entities;
using TaskListAPI.Repository;

namespace TaskListAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriaController : ControllerBase
    {
        private readonly IGenericRepository<Categoria> _repository;

        public CategoriaController(IGenericRepository<Categoria> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias()
        {
            return Ok(await _repository.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Categoria>> GetCategoria(int id)
        {
            var categoria = await _repository.GetByIdAsync(id);

            if (categoria == null)
            {
                return NotFound();
            }

            return Ok(categoria);
        }

        [HttpPost]
        public async Task<ActionResult<Categoria>> PostCategoria(Categoria categoria)
        {
            categoria.CriadoEm = System.DateTime.UtcNow;
            await _repository.AddAsync(categoria);
            return CreatedAtAction(nameof(GetCategoria), new { id = categoria.Id }, categoria);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoria(int id, Categoria categoria)
        {
            if (id != categoria.Id)
            {
                return BadRequest();
            }

            var existingCategory = await _repository.GetByIdAsync(id);
            if (existingCategory == null)
            {
                return NotFound();
            }

            existingCategory.Nome = categoria.Nome;

            await _repository.UpdateAsync(existingCategory);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}