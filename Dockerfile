# Use the latest Node.js LTS version
FROM node:lts-alpine

# Set the working directory to /producer
RUN mkdir -p /home/node/producer/node_modules && chown -R node:node /home/node/producer

WORKDIR /home/node/producer

# Copy the current directory contents into the container at /producer
COPY . /home/node/producer

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "node", "app.js" ]