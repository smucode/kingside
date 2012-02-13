#!/bin/bash
autolint --once
vows src/rex/test/*

buster test --node

