rm -rf ../kingside-build
mkdir ../kingside-build
cp -R css ../kingside-build/css
cp -R img ../kingside-build/img
cp -R lib ../kingside-build/lib
cp -R node_modules ../kingside-build/node_modules
mkdir ../kingside-build/src
cp -R src/auth ../kingside-build/src/auth
cp -R src/ga ../kingside-build/src/ga

cp favicon.ico ../kingside-build
cp index.html ../kingside-build
cp server.js ../kingside-build
cp package.json ../kingside-build

mkdir ../kingside-build/src/kingside

r.js -o name=kingside out=../kingside-build/src/kingside/kingside.js baseUrl=src/kingside
