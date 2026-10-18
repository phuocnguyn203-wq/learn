curl -s -w "\nHTTP %{http_code}\n" -X PUT http://localhost:3000/projects/$1 \
-H "x-api-key: helloworld" -H "Content-Type: application/json" \
-d "$2"
