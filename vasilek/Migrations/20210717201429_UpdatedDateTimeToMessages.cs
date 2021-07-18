using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace vasilek.Migrations
{
    public partial class UpdatedDateTimeToMessages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateTime",
                table: "Messages");

            migrationBuilder.AddColumn<string>(
                name: "Date",
                table: "Messages",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Time",
                table: "Messages",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "Time",
                table: "Messages");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateTime",
                table: "Messages",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
