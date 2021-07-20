﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using vasilek;

namespace vasilek.Migrations
{
    [DbContext(typeof(AppDatabaseContext))]
    [Migration("20210720071945_fixed#1")]
    partial class fixed1
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.7")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("DialogModelUserModel", b =>
                {
                    b.Property<int>("DialogsId")
                        .HasColumnType("int");

                    b.Property<int>("usersId")
                        .HasColumnType("int");

                    b.HasKey("DialogsId", "usersId");

                    b.HasIndex("usersId");

                    b.ToTable("DialogModelUserModel");
                });

            modelBuilder.Entity("vasilek.Models.DialogModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("AuthorId")
                        .HasColumnType("int");

                    b.Property<DateTime>("DateCreate")
                        .HasColumnType("datetime2");

                    b.Property<int>("RecipientId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Dialogs");
                });

            modelBuilder.Entity("vasilek.Models.FriendModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("SubscriberId")
                        .HasColumnType("int");

                    b.Property<int?>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Follows");
                });

            modelBuilder.Entity("vasilek.Models.MessageModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("DateCreate")
                        .HasColumnType("datetime2");

                    b.Property<int>("DialogId")
                        .HasColumnType("int");

                    b.Property<string>("MessageText")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("DialogId");

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("vasilek.Models.PhotoModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Photos");
                });

            modelBuilder.Entity("vasilek.Models.UserModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AvaPhoto")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("City")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Country")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Login")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("NickName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Status")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("DialogModelUserModel", b =>
                {
                    b.HasOne("vasilek.Models.DialogModel", null)
                        .WithMany()
                        .HasForeignKey("DialogsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("vasilek.Models.UserModel", null)
                        .WithMany()
                        .HasForeignKey("usersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("vasilek.Models.FriendModel", b =>
                {
                    b.HasOne("vasilek.Models.UserModel", "User")
                        .WithMany("Friends")
                        .HasForeignKey("UserId");

                    b.Navigation("User");
                });

            modelBuilder.Entity("vasilek.Models.MessageModel", b =>
                {
                    b.HasOne("vasilek.Models.DialogModel", "Dialog")
                        .WithMany("Messages")
                        .HasForeignKey("DialogId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Dialog");
                });

            modelBuilder.Entity("vasilek.Models.PhotoModel", b =>
                {
                    b.HasOne("vasilek.Models.UserModel", "User")
                        .WithMany("Photos")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("vasilek.Models.DialogModel", b =>
                {
                    b.Navigation("Messages");
                });

            modelBuilder.Entity("vasilek.Models.UserModel", b =>
                {
                    b.Navigation("Friends");

                    b.Navigation("Photos");
                });
#pragma warning restore 612, 618
        }
    }
}
