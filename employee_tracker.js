const mysql = require("mysql");

const DB_name = "DB_NAME";

const con = mysql.createConnection({
host: "localhost",
user: "root",
password: "password",
database: DB_name,
});

const initialiazeTables = () => {
var sql_querries = `DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS department;
CREATE TABLE department (id INTEGER PRIMARY KEY AUTO_INCREMENT, name VARCHAR(30));
CREATE TABLE role (id INTEGER PRIMARY KEY AUTO_INCREMENT, title VARCHAR(30), salary DECIMAL, department_id INTEGER, FOREIGN KEY (department_id) REFERENCES department(id));
CREATE TABLE employee (id INTEGER PRIMARY KEY AUTO_INCREMENT, first_name VARCHAR(30),last_name VARCHAR(30),role_id INTEGER,manager_id INTEGER, FOREIGN KEY (role_id) REFERENCES role(id), FOREIGN KEY (manager_id) REFERENCES employee(id));`;

for (let sql of sql_querries.split("\n")) {
	con.query(sql, function (err, result) {
		if (err) throw err;
		console.log("Table created");
	});
}
};

con.connect(function (err) {
if (err) throw err;
else initialiazeTables();
});