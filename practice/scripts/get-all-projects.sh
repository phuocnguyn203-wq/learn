curl -s -w "\nHTTP %{http_code}\n" http://localhost:3000/projects \
-H "x-api-key: helloworld"
