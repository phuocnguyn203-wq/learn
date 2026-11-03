curl -s -w "\nHTTP %{http_code}\n" -X POST http://localhost:3000/projects \
-H "Authorization: Bearer $AT" -H "Content-Type: application/json" \
-d "{ \"name\": \"$name\", \"description\": \"$description\" }"
