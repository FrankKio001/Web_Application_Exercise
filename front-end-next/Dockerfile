# 使用 Node.js 官方鏡像作為基礎鏡像，這次使用 Node.js 18 版本
FROM node:18-alpine AS builder

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json（如果有）到工作目錄
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製剩餘的應用程序代碼到工作目錄
COPY . .

# 構建 Next.js 應用程序
RUN npm run build

# 使用一個更小的鏡像來運行應用程序
FROM node:18-alpine AS runner

WORKDIR /app

# 複製構建過程中的必要文件和目錄
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.mjs ./

# 設置環境變量
ENV NODE_ENV production

# 暴露端口
#EXPOSE 3000

# 啟動 Next.js 應用程序
CMD ["npm", "start"]
