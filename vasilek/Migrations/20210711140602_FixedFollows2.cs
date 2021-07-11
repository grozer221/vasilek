using Microsoft.EntityFrameworkCore.Migrations;

namespace vasilek.Migrations
{
    public partial class FixedFollows2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Follows_Users_UserId",
                table: "Follows");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Follows",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Follows_Users_UserId",
                table: "Follows",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Follows_Users_UserId",
                table: "Follows");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Follows",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Follows_Users_UserId",
                table: "Follows",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
