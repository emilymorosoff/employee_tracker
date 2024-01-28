const {prompt} = require("inquirer");
const mysql = require("mysql");

const DB_name = "DB_NAME";

const con = mysql.createConnection({
host: "localhost",
user: "root",
password: "password",
database: DB_name,
});

function addMockData(){
	var sql = "insert into department (name) values ?"
	var values = [["Sales"], ["Legal"], ["Engineering"], ["Finance"]];
	con.query (sql, [values], function(error, result) {
		if (error) throw error;
		else console.log("rows affected " + result.affectedRows)
	})

	sql = "insert into role (title, salary, department_id) values ?"
	var values = [
		["Software Engineer", 120000.00, 3], 
		["Engineer Manager", 240000.00, 3], 
		["Sales Representative", 80000.00, 1], 
		["Sales Manager", 120000.00, 1], 
		["Attorney", 100000.00, 2], 
		["Case Manager", 100000.00, 2], 
		["Financial Advisor", 100000.00, 4],
		["Portfolio Manager", 150000.00, 4],
	]
	con.query (sql, [values], function(error, result) {
		if (error) throw error;
		else console.log("rows affected " + result.affectedRows)
	})
}

function viewAllDepartments(){
	const sql = "SELECT * FROM department;"
	con.query(sql, function(error, result) {
		if(error) throw error;
		else console.table(result)
	})
}

function viewAllRoles() {
	const sql = "SELECT * FROM role ORDER by department_id;"
	con.query(sql, function(error, result){
		if(error) throw error;
		else console.table(result)
	})
}

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
initialiazeTables();

addMockData(); 

viewAllDepartments();

viewAllRoles();
});
