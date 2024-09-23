FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN apt-get update && apt-get install -y curl

RUN curl -o /usr/local/bin/wait-for-it https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && \
    chmod +x /usr/local/bin/wait-for-it

COPY ./wait-for-it.sh /usr/local/bin/wait-for-it.sh

RUN RUN chmod +x /usr/local/bin/wait-for-it.sh

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

EXPOSE 3001

CMD /usr/local/bin/wait-for-it db:5432 --timeout=60 --strict -- \
    # migrate generate
    npm run m:gen && \
    # run init migrate
    npm run m:run && \  
    npm run start:prod
