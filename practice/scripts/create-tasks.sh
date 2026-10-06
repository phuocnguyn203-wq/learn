curl -X POST -i http://localhost:3000/projects/$1/tasks \
-H "x-api-key: helloworld" \
-H "Content-Type: application/json" \
-d "{ \"title\": \"$name\", \"priority\": \"$priority\", \"dueDate\": \"$dueDate\" }"