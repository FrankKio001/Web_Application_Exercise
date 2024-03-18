#使用Node.js環境
FROM node:14 as builder
WORKDIR /app
COPY package*.json ./
# 安裝
RUN npm install
COPY . .
#build
RUN npm run build

# 使用 Nginx 镜像作为运行环境
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
# 使用 Nginx 映像檔作為運作環境
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
