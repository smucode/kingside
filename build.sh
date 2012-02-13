rm -rf ../kingside-build

mkdir ../kingside-build
mkdir ../kingside-build/www

cp -R www/css ../kingside-build/www/css
cp -R www/img ../kingside-build/www/img
cp -R www/lib ../kingside-build/www/lib

cp -R lib ../kingside-build/lib
cp -R src ../kingside-build/src
# cp -R node_modules ../kingside-build/node_modules

mkdir ../kingside-build/www/src

cp -R www/src/ga ../kingside-build/www/src/ga

cp www/favicon.ico ../kingside-build/www
cp www/index.html ../kingside-build/www
cp app.js ../kingside-build/server.js

cp package.json ../kingside-build

mkdir ../kingside-build/www/src/kingside

r.js -o name=kingside out=../kingside-build/www/src/kingside/kingside.js baseUrl=www/src/kingside
