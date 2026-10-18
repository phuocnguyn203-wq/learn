curl -s -w "\nHTTP %{http_code}\n" -X DELETE http://localhost:3000/tasks/$1 \
-H "x-api-key: helloworld"
