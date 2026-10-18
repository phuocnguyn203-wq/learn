q="projectId=$projectId"
[ -n "$status" ] && q="$q&status=$status"
[ -n "$sort" ]   && q="$q&sort=$sort"
[ -n "$page" ]   && q="$q&page=$page"
[ -n "$limit" ]  && q="$q&limit=$limit"
curl -s -w "\nHTTP %{http_code}\n" "http://localhost:3000/tasks?$q" \
-H "x-api-key: helloworld"
