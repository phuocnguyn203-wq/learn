due=""
[ -n "$dueDate" ] && due=", \"dueDate\": \"$dueDate\""
curl -s -w "\nHTTP %{http_code}\n" -X POST http://localhost:3000/tasks \
-H "Authorization: Bearer $AT" -H "Content-Type: application/json" \
-d "{ \"projectId\": $projectId, \"title\": \"$title\", \"priority\": \"${priority:-medium}\"$due }"
