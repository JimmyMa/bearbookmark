#!/bin/bash

cd server
nohup yarn start &

cd ../frontend
nohup yarn start &
