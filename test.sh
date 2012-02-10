#!/bin/bash

jshint src/*
jshint www/src/*

vows src/rex/test/*

buster test

