@echo.
set trycount = 0

:redo
set /a trycount = %trycount% + 1
@echo Try %trycount% to connect to MySQL
set /p dbhost=Database Host:
set /p dbinstance=Database:
set /p name=Name:

mysql -h %dbhost% -p -u %name% %dbinstance% --default-character-set=utf8 -e "source db_init_mysql.sql"

if errorlevel 0 goto :end

if %trycount% == 3 goto quit
goto redo

:end
@echo.

:quit
@echo %trycount% tries applied, quitting.

