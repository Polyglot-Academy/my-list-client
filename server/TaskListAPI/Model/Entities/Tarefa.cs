
namespace TaskListAPI.Model.Entities
{
    public enum StatusEnum
    {
        Pendente,
        Concluida
    }

    public class Tarefa
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public int? CategoriaId { get; set; }
        public string Titulo { get; set; }
        public string Descricao { get; set; }
        public DateTime? DataVencimento { get; set; }
        public TimeSpan? HoraVencimento { get; set; }
        public StatusEnum Status { get; set; }
        public DateTime CriadoEm { get; set; }
    }
}