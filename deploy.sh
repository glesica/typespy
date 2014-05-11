#! /usr/bin/env bash

git pull origin master
rm -rf /usr/share/typespy
cp -r www /usr/share/typespy
service nginx restart
