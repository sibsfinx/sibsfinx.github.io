fetch:
	make clean
	yarn
	yarn tsc
	yarn node ./dist/fetch.js
	make move
	make copy
# make process

clean:
	rm -rf package || true

process:
	find package -type f -exec sed -i \
	-e 's/w-webflow-badge/u__badge u__hide/g' \
	-e 's/index\.html//g' \
	-e 's/octobear.webflow.io//g' \
	{} +

# -e 's/uploads-ssl.webflow.com/assets/g' \

move:
	echo "move assets"
	mv package/octobear.webflow.io/* package || true
	
# mv package/uploads-ssl.webflow.com/* package/assets || true
# mkdir -p package/images
# mv package/**/*{.png,.jpg,.jpeg,.gif,.svg} package/images || true

preview:
	cd package && \
	yarn http-server -c-1 -o .

copy:
	cp -r files/* package/

# prepare-ci-env:
# 	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
# 	npm install -g yarn

prepare-ci-yarn:
	nvm use
	yarn set version 3.2.1

# make prepare-ci-env
deploy-ci:
	make prepare-ci-yarn
	make fetch
