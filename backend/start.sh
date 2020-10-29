#!/bin/bash
sudo service postgresql start
docker run -p 6379:6379 -d redis:5
