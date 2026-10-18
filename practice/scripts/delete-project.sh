curl -s -w "\nHTTP %{http_code}\n" -X DELETE http://localhost:3000/projects/$1 \
-H "x-api-key: helloworld"
