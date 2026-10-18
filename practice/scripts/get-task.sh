curl -s -w "\nHTTP %{http_code}\n" http://localhost:3000/tasks/$1 \
-H "x-api-key: helloworld"
