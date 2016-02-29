@echo Home Info. Hub
@echo Tools for initialize the database.
@echo Copyright by Alva Chien, 2014 -2016

@echo off
REM db_init.bat - create and load the DB tables for HIH

REM Usage:
REM db_init.bat [options] db_name
REM options may be connection parameters if you need to specify them:
REM db_init.bat -p -u sampadm db_name

:: Loop through the variables in environment
::setlocal enabledelayedexpansion
::FOR /F "usebackq delims==" %%i IN (`set`) DO @echo %%i !%%i!

if not "%1" == "" goto LOAD
  @echo Usage: db_init [options] db_name
  goto DONE

:LOAD
:: mysql -e "source init_all_tables.sql" %*

:DONE
