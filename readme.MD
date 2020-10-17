#setup postgres
```sudo apt-get install python3-dev libpq-dev postgresql postgresql-contrib
pip3 install django psycopg2
sudo su - postgres
psql
CREATE DATABASE rockpaperscissors;
CREATE USER rockpaperscissors WITH PASSWORD 'password';
ALTER ROLE rockpaperscissors SET client_encoding TO 'utf8';
ALTER ROLE rockpaperscissors SET default_transaction_isolation TO 'read committed';
ALTER ROLE rockpaperscissors SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE rockpaperscissors TO rockpaperscissors;```

#settings.py
```DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'myproject',
        'USER': 'myprojectuser',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '',
    }
}```