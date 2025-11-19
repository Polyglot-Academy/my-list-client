using TaskListAPI.Data;
using TaskListAPI.Repository;
using Microsoft.EntityFrameworkCore;
using TaskListAPI.Model.Entities;
using TaskListAPI.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<TaskListDbContext>(options =>
    options.UseNpgsql(connectionString)
);

builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();

builder.Services.AddScoped<IGenericRepository<Categoria>, GenericRepository<Categoria>>();
builder.Services.AddScoped<IGenericRepository<Tarefa>, GenericRepository<Tarefa>>();
builder.Services.AddScoped<IGenericRepository<LoginSessao>, GenericRepository<LoginSessao>>();

builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowAllOrigins",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();


app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseCors("AllowAllOrigins");

// Adicionar Autentica��o e Autoriza��o na ordem correta
app.UseAuthentication(); // Adicione se estiver implementando autentica��o
app.UseAuthorization();

app.MapControllers();
app.Run();