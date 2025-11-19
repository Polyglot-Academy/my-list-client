namespace TaskListAPI.Model.Entities
{
    public class LoginSessao
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public string Token { get; set; }
        public DateTime CriadoEm { get; set; }
        public DateTime ExpiraEm { get; set; }
    }
}