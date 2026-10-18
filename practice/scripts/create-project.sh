curl -s -w "\nHTTP %{http_code}\n" -X POST http://localhost:3000/projects \
-H "x-api-key: helloworld" -H "Content-Type: application/json" \
-d "{ \"name\": \"$name\", \"description\": \"$description\" }"
