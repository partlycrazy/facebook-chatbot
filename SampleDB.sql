create table users (
	id SERIAL NOT NULL PRIMARY KEY,
	psid TEXT,
	name TEXT,
	outlet_id int
);

create table vouchers (
	id SERIAL NOT NULL PRIMARY KEY,
	voucher_id int,
	voucher_amt NUMERIC,
	created_at TIMESTAMP,
	outlet_id int
);

create table vouchers_claim (
	id SERIAL NOT NULL PRIMARY KEY,
	voucher_id int REFERENCES vouchers (id),
	user_id INT REFERENCES users (id),
	voucher_amt NUMERIC
);

