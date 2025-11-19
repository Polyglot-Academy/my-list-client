
namespace TaskListAPI.Model.Entities
{
    public class Categoria
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public string Nome { get; set; }
        public DateTime CriadoEm { get; set; }
    }
}