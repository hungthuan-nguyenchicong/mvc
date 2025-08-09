## postgres md

sudo -i -u postgres psql

\l
\du
\du mvcdb
\c mvcdb
\dt

psql -h localhost -p 5432 -U cong -d postgres \dp \dn+ public
### user
psql -h localhost -p 5432 -U user_name -d mvcdb

\d users

mvcdb=> SELECT * FROM users;

## admin
