#!/usr/bin/env bash

mysql --user=root --password="$MYSQL_ROOT_PASSWORD" <<-EOSQL
    CREATE DATABASE IF NOT EXISTS testing;
    GRANT ALL PRIVILEGES ON \`testing%\`.* TO 'root'@'%';
    ALTER USER 'root'@'$MYSQL_ROOT_HOST' IDENTIFIED WITH mysql_native_password BY '$MYSQL_PASSWORD';
    flush privileges;
EOSQL
