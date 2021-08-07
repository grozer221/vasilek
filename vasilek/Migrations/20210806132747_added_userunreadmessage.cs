using Microsoft.EntityFrameworkCore.Migrations;

namespace vasilek.Migrations
{
    public partial class added_userunreadmessage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MessageModelId",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_MessageModelId",
                table: "Users",
                column: "MessageModelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Messages_MessageModelId",
                table: "Users",
                column: "MessageModelId",
                principalTable: "Messages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Messages_MessageModelId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_MessageModelId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "MessageModelId",
                table: "Users");
        }
    }
}
