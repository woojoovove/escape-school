FROM node:18

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

ENV PORT=80
ENV HOST=0.0.0.0

EXPOSE 80

CMD ["npm", "start"]
