using Microsoft.EntityFrameworkCore.Migrations;

namespace vasilek.Migrations
{
    public partial class remove_from_dialog_dialognamecolor : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DialogNameColor",
                table: "Dialogs");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DialogNameColor",
                table: "Dialogs",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
