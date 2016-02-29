@echo off
@color 3F
@echo Home Info. Hub
@echo Tools for initialize the database.
@echo Copyright by Alva Chien, 2014 -2016
@echo.

REM db_init.bat - create and load the DB tables for HIH
REM db_init.bat -p -u sampadm db_name

:: Loop through the variables in environment
::setlocal enabledelayedexpansion
::FOR /F "usebackq delims==" %%i IN (`set`) DO @echo %%i !%%i!

if not "%1" == "" goto LOAD
choice /M "Choose the database: M[y]Sql, M[S] SQL Server, [e]xit" /C YSE
if errorlevel 3 goto DONE
if errorlevel 2 goto MSSQL
if errorlevel 1 goto MYSQL

:: Handle the case that parameters have been filled
:LOAD
if "%1" == "mysql" goto MYSQL
if "%1" == "mssql" goto MSSQL

@echo Error: Cannot recognize inputted parameter: "%1"
@echo.
@echo Usage: db_init [DB]
@echo Allow DB: mysql; mssql
goto DONE

:: Connect to MySQL
:MYSQL
@echo Connecting to MYSQL...
call db_init_mysql.bat
goto DONE

:: Connect to MS SQL Server
:MSSQL
@echo Connecting to MS SQL Server...
@echo Still a ToDo so far!
::call db_init_mssql.bat
goto DONE

:DONE
@color
@echo Done
@echo.