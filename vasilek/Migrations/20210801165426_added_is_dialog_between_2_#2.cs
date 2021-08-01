using Microsoft.EntityFrameworkCore.Migrations;

namespace vasilek.Migrations
{
    public partial class added_is_dialog_between_2_2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "IsDialogBetween2",
                table: "Dialogs",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "IsDialogBetween2",
                table: "Dialogs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");
        }
    }
}
