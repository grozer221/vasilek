using Microsoft.EntityFrameworkCore.Migrations;

namespace vasilek.Migrations
{
    public partial class updated_dialogs2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dialogs_Users_AuthorId",
                table: "Dialogs");

            migrationBuilder.DropIndex(
                name: "IX_Dialogs_AuthorId",
                table: "Dialogs");

            migrationBuilder.DropColumn(
                name: "RecipientId",
                table: "Dialogs");

            migrationBuilder.AlterColumn<int>(
                name: "AuthorId",
                table: "Dialogs",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "DialogModelUserModel",
                columns: table => new
                {
                    DialogsId = table.Column<int>(type: "int", nullable: false),
                    UsersId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DialogModelUserModel", x => new { x.DialogsId, x.UsersId });
                    table.ForeignKey(
                        name: "FK_DialogModelUserModel_Dialogs_DialogsId",
                        column: x => x.DialogsId,
                        principalTable: "Dialogs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DialogModelUserModel_Users_UsersId",
                        column: x => x.UsersId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DialogModelUserModel_UsersId",
                table: "DialogModelUserModel",
                column: "UsersId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DialogModelUserModel");

            migrationBuilder.AlterColumn<int>(
                name: "AuthorId",
                table: "Dialogs",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "RecipientId",
                table: "Dialogs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Dialogs_AuthorId",
                table: "Dialogs",
                column: "AuthorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Dialogs_Users_AuthorId",
                table: "Dialogs",
                column: "AuthorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
