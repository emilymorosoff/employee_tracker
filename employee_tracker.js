const mysql = require("mysql");
const inquirer = require("inquirer");

const DB_name = "empdb";

const con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "1205",
	database: DB_name,
});

function addMockData() {
	var sql = "insert into department (name) values ?";
	var values = [["Sales"], ["Legal"], ["Engineering"], ["Finance"]];
	con.query(sql, [values], function (error, result) {
		if (error) throw error;
	});

	sql = "insert into role (title, salary, department_id) values ?";
	var values = [
		["Engineer Manager", 240000.0, 3],
		["Sales Manager", 120000.0, 1],
		["Case Manager", 100000.0, 2],
		["Portfolio Manager", 150000.0, 4],
		["Software Engineer", 120000.0, 3],
		["Sales Representative", 80000.0, 1],
		["Attorney", 100000.0, 2],
		["Financial Advisor", 100000.0, 4],
	];
	con.query(sql, [values], function (error, result) {
		if (error) throw error;
	});
	sql = `insert into employee (first_name, last_name, role_id, manager_id) values ('Lisette', 'Lant', 1, NULL);
insert into employee (first_name, last_name, role_id, manager_id) values ('Ephrayim', 'Tabart', 2, NULL);
insert into employee (first_name, last_name, role_id, manager_id) values ('Alaric', 'Viollet', 3, NULL);
insert into employee (first_name, last_name, role_id, manager_id) values ('Phaidra', 'Keyzor', 4, NULL);
insert into employee (first_name, last_name, role_id, manager_id) values ('Taddeo', 'Hauck', 5, 1);
insert into employee (first_name, last_name, role_id, manager_id) values ('Tamas', 'Feilden', 8, 2);
insert into employee (first_name, last_name, role_id, manager_id) values ('Aldrich', 'Dunbleton', 8, 3);
insert into employee (first_name, last_name, role_id, manager_id) values ('Nero', 'Dreghorn', 6, 2);
insert into employee (first_name, last_name, role_id, manager_id) values ('Silas', 'Greenstreet', 8, 2);
insert into employee (first_name, last_name, role_id, manager_id) values ('Michelle', 'Lorrie', 8, 3);
insert into employee (first_name, last_name, role_id, manager_id) values ('Edyth', 'Colvin', 8, 3);
insert into employee (first_name, last_name, role_id, manager_id) values ('Carter', 'McGourty', 5, 1);
insert into employee (first_name, last_name, role_id, manager_id) values ('Franz', 'Doles', 8, 2);
insert into employee (first_name, last_name, role_id, manager_id) values ('Mathe', 'Cromarty', 7, 4);
insert into employee (first_name, last_name, role_id, manager_id) values ('Vere', 'Robilliard', 7, 4);
insert into employee (first_name, last_name, role_id, manager_id) values ('Thorstein', 'Lemmon', 6, 4);
insert into employee (first_name, last_name, role_id, manager_id) values ('Sarah', 'Backen', 6, 1);
insert into employee (first_name, last_name, role_id, manager_id) values ('Con', 'Vossing', 8, 1);
insert into employee (first_name, last_name, role_id, manager_id) values ('Irwin', 'Dungey', 8, 3);
insert into employee (first_name, last_name, role_id, manager_id) values ('Brooks', 'Heathcoat', 6, 4);`;
	for (let line of sql.split("\n")) {
		con.query(line.trim(), function (err, result) {
			if (err) throw err;
		});
	}

	console.info("Data inserted into tables");
}

function viewAll(table) {
	// table is a string either employee, role, department, test
	const sql = `SELECT * FROM ${table}`;

	con.query(sql, function (error, result) {
		if (error) console.error(`ERROR: no such table -> ${table}`);
		else console.table(result);
	});
}

const updateEmployee = (first_name, last_name, role_id) => {
	const sql = `UPDATE employee SET role_id=${role_id} WHERE first_name='${first_name}' AND last_name='${last_name}'`;

	console.log(sql);

	con.query(sql, (err, res) => {
		if (err) console.error(err.message);
		console.log("User employee updated!");
	});
};

const initialiazeTables = () => {
	var sql_querries = `DROP TABLE IF EXISTS employee;
		DROP TABLE IF EXISTS role;
		DROP TABLE IF EXISTS department;
		CREATE TABLE department (id INTEGER PRIMARY KEY AUTO_INCREMENT, name VARCHAR(30));
		CREATE TABLE role (id INTEGER PRIMARY KEY AUTO_INCREMENT, title VARCHAR(30), salary DECIMAL, department_id INTEGER, FOREIGN KEY (department_id) REFERENCES department(id));
		CREATE TABLE employee (id INTEGER PRIMARY KEY AUTO_INCREMENT, first_name VARCHAR(30),last_name VARCHAR(30),role_id INTEGER, manager_id INTEGER, FOREIGN KEY (role_id) REFERENCES role(id), FOREIGN KEY (manager_id) REFERENCES employee(id));`;

	for (let sql of sql_querries.split("\n")) {
		con.query(sql.trim(), function (err, result) {
			if (err) throw err;
		});
	}
};

const prompt = async () => {
	return await inquirer.prompt([
		{
			type: "list",
			name: "choice",
			message: "What would you like to do?",
			choices: [
				"view all departments",
				"view all roles",
				"view all employees",
				"add a department",
				"add a role",
				"add an employee",
				"update an employee role",
				"exit",
			],
		},
		//department
		{
			when: (answers) => answers.choice === "add a department",
			name: "departmentName",
			message: "What is the name of the departmenet?",
		},
		//role
		{
			when: (answers) => answers.choice === "add a role",
			name: "roleTitle",
			message: "What is the title of the role?",
		},
		{
			when: (answers) => answers.choice === "add a role",
			name: "roleSalary",
			message: "What is the salary of the role?",
		},
		{
			when: (answers) => answers.choice === "add a role",
			type: "list",
			name: "roleDepartmentId",
			message: "What is the department of the role?",
			choices: (() => {
				let departments = [];
				con.query(
					"SELECT id as value, name FROM department",
					(err, res) => {
						if (err) console.error(err.message);
						for (let dep of res) departments.push(dep);
					}
				);

				return departments;
			})(),
		},
		// employee
		{
			when: (answers) => answers.choice === "add an employee",
			name: "employeeFirstName",
			message: "What is the first name of the employee?",
		},
		{
			when: (answers) => answers.choice === "add an employee",
			name: "employeeLastName",
			message: "What is the last name of the employee?",
		},
		{
			when: (answers) => answers.choice === "add an employee",
			type: "list",
			name: "employeeRoleId",
			message: "What is the role of the employee?",
			choices: (() => {
				let roles = [];
				con.query(
					"SELECT id as value, title as name FROM role",
					(err, res) => {
						if (err) console.error(err.message);
						for (let rol of res) roles.push(rol);
					}
				);

				return roles;
			})(),
		},
		{
			when: (answers) => answers.choice === "add an employee",
			type: "list",
			name: "employeeManagerId",
			message: "Who is the manager of the employee?",
			choices: (() => {
				let employees = [];
				con.query(
					"SELECT id, first_name, last_name FROM employee",
					(err, res) => {
						if (err) console.error(err.message);
						res.forEach((emp) =>
							employees.push({
								value: emp.id,
								name: `${emp.first_name} ${emp.last_name}`,
							})
						);
					}
				);

				return employees;
			})(),
		},
	]);
};

con.connect(async (err) => {
	if (err) throw err;

	initialiazeTables();
	addMockData();

	let flag = true;

	while (flag) {
		answers = await prompt();

		switch (answers.choice) {
			case "view all departments":
				viewAll("department");
				break;
			case "view all roles":
				viewAll("role");
				break;
			case "view all employees":
				viewAll("employee");
				break;
			case "add a department":
				con.query(
					`INSERT INTO department (name) VALUES ('${answers.departmentName}')`,
					(err, res) => {
						if (err) console.error(err.message);
						else
							console.log(
								`Department ${answers.departmentName} added`
							);
					}
				);
				break;
			case "add a role":
				con.query(
					`INSERT INTO role (title, salary, department_id) VALUES ('${answers.roleTitle}', ${answers.roleSalary}, ${answers.roleDepartmentId})`,
					(err, res) => {
						if (err) console.error(err.message);
						else console.log(`Role ${answers.roleTitle} added`);
					}
				);
				break;
			case "add an employee":
				con.query(
					`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.employeeFirstName}', '${answers.employeeLastName}', ${answers.employeeRoleId}, ${answers.employeeManagerId})`,
					(err, res) => {
						if (err) console.error(err.message);
						else
							console.log(
								`Employee ${answers.employeeFirstName} ${answers.employeeLastName} added`
							);
					}
				);
				break;
			case "update an employee role":
				console.log("update an employee role");
				break;
			case "exit":
				flag = false;
		}
	}
	console.log("Good Bye!");
});