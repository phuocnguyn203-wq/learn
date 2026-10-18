priorities=("low" "medium" "high")
for i in {1..100}; do
  projectId=$projectId title="Task $i" \
  priority=${priorities[RANDOM % 3]} dueDate=2026-12-31 \
  bash create-tasks.sh
done
