#!/bin/bash

jshint src/*
jshint www/src/*

vows src/rex/test/*
vows src/services/test/*

