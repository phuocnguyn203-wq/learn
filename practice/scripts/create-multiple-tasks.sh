priorities=("low" "medium" "high")
for i in {1..100}; do
  name="Task $i" priority=${priorities[RANDOM % ${#priorities[@]}]} dueDate=2026-10-10 \
  bash create-tasks.sh $projectId
done