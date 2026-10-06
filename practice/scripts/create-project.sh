curl -X POST http://localhost:3000/projects \
-H "Content-Type: application/json" \
-H "x-api-key: helloworld" \
-d "{ \"name\": \"$name\", \"description\": \"$description\" }"