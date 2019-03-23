FROM node

ADD . /src
WORKDIR /src

RUN yarn 

ENV PATH ./node_modules/.bin:$PATH
CMD ["yarn","start"]
