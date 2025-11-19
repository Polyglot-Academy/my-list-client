namespace TaskListAPI.Model.DTOs
{
    public class AuthResponseDTO
    {
        public string Token { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string UserEmail { get; set; } = string.Empty;
    }
}