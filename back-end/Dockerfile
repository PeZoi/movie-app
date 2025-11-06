# Sử dụng node LTS
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package và cài đặt
COPY package*.json ./
RUN npm install

# Copy toàn bộ source
COPY . .

# Build NestJS
RUN npm run build

# Expose port
EXPOSE 

# Start app
CMD ["npm", "run", "start:prod"]
