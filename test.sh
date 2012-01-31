#!/bin/bash
jshint src/rex/*
jshint src/event/*
jshint src/services/*

jshint www/src/*

vows src/rex/test/*
vows src/services/test/*

