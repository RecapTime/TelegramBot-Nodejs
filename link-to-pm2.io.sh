#!/bin/bash

## To get 2 tokens, create an new account on app.pm2.io.
## Then, create an bucket. And, look for PM2_SECRET_KEY and PM2_PUBLIC_KEY.

## To run this script, you need the following environment variables configured:
## - TERRORISER_TOKEN1: this is your PM2 Plus bucket secret key
## - TERRORISER_TOKEN2: and, this is your PM2 Plus bucket public key

## Link it
pm2 link $TERRORISER_TOKEN1 $TERRORISER_TOKEN2