using Microsoft.EntityFrameworkCore.Migrations;

namespace vasilek.Migrations
{
    public partial class FixedFollows : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Follows_Users_UserModelId",
                table: "Follows");

            migrationBuilder.RenameColumn(
                name: "UserModelId",
                table: "Follows",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Follows_UserModelId",
                table: "Follows",
                newName: "IX_Follows_UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Follows_Users_UserId",
                table: "Follows",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Follows_Users_UserId",
                table: "Follows");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Follows",
                newName: "UserModelId");

            migrationBuilder.RenameIndex(
                name: "IX_Follows_UserId",
                table: "Follows",
                newName: "IX_Follows_UserModelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Follows_Users_UserModelId",
                table: "Follows",
                column: "UserModelId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
