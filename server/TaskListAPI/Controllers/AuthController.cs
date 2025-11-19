using Microsoft.AspNetCore.Mvc;
using TaskListAPI.Model.DTOs;
using TaskListAPI.Repository;
using TaskListAPI.Services;


namespace TaskListAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUsuarioRepository _userRepository;
        private readonly IAuthService _authService;

        public AuthController(IUsuarioRepository userRepository, IAuthService authService)
        {
            _userRepository = userRepository;
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userRepository.GetByEmailAsync(model.Email);


            bool isPasswordValid = _userRepository.VerifyPassword(user, model.Password);

            if (user == null || !isPasswordValid)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            var tokenString = _authService.GenerateJwtToken(user);

            var response = new AuthResponseDTO
            {
                Token = tokenString,
                UserId = user.Id,
                UserEmail = user.Email
            };

            return Ok(response);
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok(new { message = "Logged out successfully (token discarded on client)." });
        }
    }
}