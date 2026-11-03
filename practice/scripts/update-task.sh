curl -s -w "\nHTTP %{http_code}\n" -X PUT http://localhost:3000/tasks/$1 \
-H "Authorization: Bearer $AT" -H "Content-Type: application/json" \
-d "$2"
