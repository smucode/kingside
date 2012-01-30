#!/bin/bash
jshint src/rex/*
jshint src/event/*
jshint src/fooboard/*
jshint src/kingside/*
jshint src/services/*
vows src/rex/test/*
vows src/services/test/*

