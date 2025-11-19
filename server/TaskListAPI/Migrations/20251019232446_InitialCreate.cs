using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TaskListAPI.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "lista_tarefas");

            migrationBuilder.CreateTable(
                name: "Usuarios",
                schema: "lista_tarefas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Senha = table.Column<string>(type: "text", nullable: false),
                    CriadoEm = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Categorias",
                schema: "lista_tarefas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UsuarioId = table.Column<int>(type: "integer", nullable: false),
                    Nome = table.Column<string>(type: "text", nullable: false),
                    CriadoEm = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categorias", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Categorias_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalSchema: "lista_tarefas",
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LoginSessoes",
                schema: "lista_tarefas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UsuarioId = table.Column<int>(type: "integer", nullable: false),
                    Token = table.Column<string>(type: "text", nullable: false),
                    CriadoEm = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiraEm = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoginSessoes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LoginSessoes_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalSchema: "lista_tarefas",
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tarefas",
                schema: "lista_tarefas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UsuarioId = table.Column<int>(type: "integer", nullable: false),
                    CategoriaId = table.Column<int>(type: "integer", nullable: true),
                    Titulo = table.Column<string>(type: "text", nullable: false),
                    Descricao = table.Column<string>(type: "text", nullable: false),
                    DataVencimento = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    HoraVencimento = table.Column<TimeSpan>(type: "interval", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false),
                    CriadoEm = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tarefas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tarefas_Categorias_CategoriaId",
                        column: x => x.CategoriaId,
                        principalSchema: "lista_tarefas",
                        principalTable: "Categorias",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Tarefas_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalSchema: "lista_tarefas",
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Categorias_UsuarioId",
                schema: "lista_tarefas",
                table: "Categorias",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_LoginSessoes_UsuarioId",
                schema: "lista_tarefas",
                table: "LoginSessoes",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Tarefas_CategoriaId",
                schema: "lista_tarefas",
                table: "Tarefas",
                column: "CategoriaId");

            migrationBuilder.CreateIndex(
                name: "IX_Tarefas_UsuarioId",
                schema: "lista_tarefas",
                table: "Tarefas",
                column: "UsuarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LoginSessoes",
                schema: "lista_tarefas");

            migrationBuilder.DropTable(
                name: "Tarefas",
                schema: "lista_tarefas");

            migrationBuilder.DropTable(
                name: "Categorias",
                schema: "lista_tarefas");

            migrationBuilder.DropTable(
                name: "Usuarios",
                schema: "lista_tarefas");
        }
    }
}
