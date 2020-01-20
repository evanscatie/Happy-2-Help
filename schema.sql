create TABLE users (
    user_id serial PRIMARY key,
    first_name text,
    last_name text,
    organization_name text,
    email text,
    phone_number VARCHAR(12),
    user_name text unique NOT NULL,
    password text NOT NULL  
);

create TABLE events (
    event_id serial PRIMARY key,
    event_name text,
    event_location text,
    event_date date,
    event_time time,
    event_description text,
    user_id INTEGER REFERENCES users(user_id) NOT NULL
    -- NOT NULL: Forces every event to have an user id, otherwise event cannot be created
);


create TABLE tasks (
    task_id serial PRIMARY key,
    task text,
    event_id INTEGER REFERENCES events(event_id) NOT NULL
    -- NOT NULL: Forces every task to have an event id, otherwise task cannot be created

);


create TABLE task_assignment (
    task_assignment_id serial PRIMARY key,
    task_id INTEGER REFERENCES tasks (task_id) NOT NULL,
    user_id INTEGER REFERENCES users (user_id) NOT NULL 
);