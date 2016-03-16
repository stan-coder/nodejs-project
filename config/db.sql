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

insert into users(email, name, surname, birthday) value ('felix@debuggable.com', 'Felix', 'Ordovsky', '1989-03-30');
insert into users(email, name, surname, birthday) value ('ken.woodruff@gmail.com', 'Ken', 'Woodruff', '1991-02-12');
insert into users(email, name, surname, birthday) value ('tolga.ekmen@gmail.com', 'Tolga', 'Ekmen', '2002-10-28');
insert into users(email, name, surname, birthday) value ('sean.monstar@gmail.com', 'Sean', 'McArthur', '1979-07-17');
insert into users(email, name, surname, birthday) value ('dresende@thinkdigital.pt', 'Diogo', 'Resende', '1999-05-22');
insert into users(email, name, surname, birthday) value ('natalie@lifewanted.com', 'Natalie', 'Lillich', '1994-10-01');
