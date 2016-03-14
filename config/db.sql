create table users (
	id int unsigned not null primary key auto_increment,
	email varchar(30) not null,
	name varchar(20) not null, 
	surname varchar(20) not null, 
	birthday date not null
) CHARACTER SET utf8 COLLATE utf8_general_ci ENGINE=INNODB;

create table admins (
	id int unsigned not null primary key auto_increment,
	username varchar(15) not null,
	password varchar(128) not null,
	salt varchar(128) not null
) CHARACTER SET utf8 COLLATE utf8_general_ci ENGINE=INNODB;

insert into users(email, name, surname, birthday) value ('markus@gmail.com', 'Markus', 'Shultz', '1978-10-29');
insert into users(email, name, surname, birthday) value ('salina@mail.biz', 'Salina', 'Irety', '1969-02-17');
insert into users(email, name, surname, birthday) value ('filip@developer.net', 'Fox', 'Gaz', '2002-12-30');
insert into users(email, name, surname, birthday) value ('marya@fenix.eu', 'Mary', 'Gasparyan', '1977-07-09');
insert into users(email, name, surname, birthday) value ('samson@my-mail.ly', 'Samson', 'Denisov', '1998-11-19');
insert into users(email, name, surname, birthday) value ('yury@job.mx', 'Yury', 'Pak', '2001-05-29');
insert into users(email, name, surname, birthday) value ('max@about.me', 'Max', 'Thompson', '1984-12-17');