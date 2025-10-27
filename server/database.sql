create database viruma;

\c viruma;

create table users (
    id serial primary key,
    username varchar(50) unique not null,
    email varchar(100) unique not null,
    password varchar(255) not null,
    role varchar(20) default 'user' CHECK (role IN ('user', 'admin')),
    created_at timestamp default current_timestamp
);

create table articles(
    id serial primary key,
    title varchar(255) not null,
    content text not null,
    author_id integer references users(id),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

insert into users (username, email, password, role) values
('admin', 'admin@gmail.com', 'adminpassword', 'admin');