# Chạy bằng `source login.sh` (không phải bash) để giữ lại biến AT, RT
# Đổi tài khoản: email=a@example.com password=12345678 source login.sh
RES=$(curl -s -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" \
  -d "{\"email\":\"${email:-me@example.com}\",\"password\":\"${password:-12345678}\"}")
# export để các script chạy bằng `bash xxx.sh` cũng đọc được
export AT=$(echo "$RES" | sed -E 's/.*"accessToken":"([^"]+)".*/\1/')
export RT=$(echo "$RES" | sed -E 's/.*"refreshToken":"([^"]+)".*/\1/')

curl -s -w "\nHTTP %{http_code}\n" http://localhost:3000/auth/me -H "Authorization: Bearer $AT"
