FROM daocloud.io/library/node:12

WORKDIR /cli
## get latest code from github.com
RUN npm install --save git://github.com/kequandian/zero-json.git#master
RUN mv node_modules/zero-json/* .
#install-stage
RUN npm config set registry https://registry.npm.taobao.org
RUN npm install
RUN npm link

#test
WORKDIR /web
ADD ./swagger/swagger.json /web/swagger/swagger.json

