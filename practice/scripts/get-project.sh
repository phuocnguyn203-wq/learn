curl -s -w "\nHTTP %{http_code}\n" http://localhost:3000/projects/$1 \
-H "x-api-key: helloworld"
