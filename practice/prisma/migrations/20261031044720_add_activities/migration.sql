-- CreateTable
CREATE TABLE "activities" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "from_project_id" INTEGER NOT NULL,
    "to_project_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activities_task_id_idx" ON "activities"("task_id");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_from_project_id_fkey" FOREIGN KEY ("from_project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_to_project_id_fkey" FOREIGN KEY ("to_project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
