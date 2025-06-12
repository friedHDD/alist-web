# replace version
cd alist-web
version=$(git describe --abbrev=0 --tags)
sed -i -e "s/\"version\": \"0.0.0\"/\"version\": \"$version\"/g" package.json
cat package.json

# build
pnpm install
pnpm i18n:release
pnpm build
cd ..

tar -czvf dist.tar.gz dist/*