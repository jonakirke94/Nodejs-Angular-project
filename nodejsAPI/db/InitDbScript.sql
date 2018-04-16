USE master
GO
if exists (select * from sysdatabases where name='LeanDb')
		drop database LeanDb
GO

CREATE DATABASE LeanDb;
GO

Use LeanDb
GO

CREATE TABLE Products (
	ProductId "int" IDENTITY (1, 1) NOT NULL ,
	"Name" nvarchar (20) NOT NULL ,
	"Description" "ntext" NULL ,
	CONSTRAINT "PK_Products" PRIMARY KEY  CLUSTERED 
	(
		ProductId
	)
)
GO

CREATE TABLE Users (
	UserId "int" IDENTITY (1, 1) NOT NULL ,
	"Name" nvarchar (20) NULL ,
	"Email" nvarchar (max) NULL ,
    "Password" nvarchar(max) NULL ,
	"Refreshtoken" nvarchar(max) NULL,
	"IsLockedOut" bit,
	CONSTRAINT "PK_Users" PRIMARY KEY  CLUSTERED 
	(
		UserId
	)
)
GO


INSERT "Products" VALUES('Hammer','Det er et værktøj')
INSERT "Products" VALUES('Sko','Man kan gå i dem')
INSERT "Products" VALUES('IphoneX','Apple produkt')
INSERT "Products" VALUES('Kuglepen','Skriv med mig')
INSERT "Products" VALUES('Elefant','Jeg er stor og farlig')
INSERT "Products" VALUES('Rom','Drik mig')
GO
