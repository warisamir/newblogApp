FROM node:alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./
CMD ["npm","start"]
# FROM node:latest

# COPY . ./

# CMD npm i 
# CMD npm start