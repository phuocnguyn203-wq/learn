curl -X POST -i http://localhost:3000/tasks \
-H "x-api-key: helloworld" \
-H "Content-Type: application/json" \
-d "{ \"projectId\": \"$projectId\", \"title\": \"$title\", \"priority\": \"$priority\", \"dueDate\": \"$dueDate\" }"