FROM node

ADD . /src
WORKDIR /src

RUN yarn 

ENV PATH ./node_modules/.bin:$PATH
CMD ["./wait-for-it","database:5432","--","yarn","start"]
