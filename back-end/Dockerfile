# 官方Go環境
FROM golang:1.22 as builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod tidy
#RUN go mod download
# 複製原始碼
COPY . .

# 建置二進位文件
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/api

# 使用官方 Alpine 鏡像作為運行環境
FROM alpine:latest  
RUN apk --no-cache add ca-certificates
WORKDIR /root/
# 從建置階段複製二進位文件
COPY --from=builder /app/main .

EXPOSE 8080
# 執行
CMD ["./main"]
