FROM postgres:latest

COPY init.sql /docker-entrypoint-initdb.d/
COPY seed.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
