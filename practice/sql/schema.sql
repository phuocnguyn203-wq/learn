CREATE TABLE users (
  id integer GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  CONSTRAINT user_primary_key PRIMARY KEY (id)
);

CREATE TABLE projects (
  id integer GENERATED ALWAYS AS IDENTITY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamp WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT projects_primary_key PRIMARY KEY (id)
);

CREATE TABLE tasks (
  id integer GENERATED ALWAYS AS IDENTITY,
  project_id integer NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  priority text NOT NULL DEFAULT 'low',
  due_date timestamp WITH TIME ZONE,
  created_at timestamp WITH TIME ZONE DEFAULT NOW(),
  completed_at timestamp WITH TIME ZONE,
  CONSTRAINT tasks_primary_key PRIMARY KEY (id),
  CONSTRAINT check_priority CHECK (priority IN ('low' ,'medium', 'high'))
);

CREATE TABLE labels (
  id integer GENERATED ALWAYS AS IDENTITY,
  project_id integer NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text NOT NULL,
  CONSTRAINT labels_primary_key PRIMARY KEY (id),
  CONSTRAINT labels_project_id_name_key UNIQUE (project_id, name)
);

CREATE TABLE task_labels (
  task_id integer REFERENCES tasks(id) ON DELETE CASCADE,
  label_id integer REFERENCES labels(id) ON DELETE CASCADE,
  CONSTRAINT task_labels_primary_key PRIMARY KEY (task_id, label_id)
);
