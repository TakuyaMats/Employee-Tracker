const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
let roles = require('./lib/role');
let managers = require('./lib/manager');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'mypassword1122',
    database: 'employeeTracker_DB',
});


const start = () => {
    clear();
    console.log(
        chalk.red(
            figlet.textSync('Employee-Tracker', {
                horizontalLayout: 'full'
            })
        )
    );
    inquirer
        .prompt({
            name: 'employeeManager',
            type: 'list',
            message: 'Would you like to do?',
            choices: [
                'View All Employees',
                'View All Employees By Department',
                'View All Employees By Manager',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View All Roles',
                'Add Role',
                'Remove Role',
                'Exit'
            ],
        })
        .then((answer) => {
            switch (answer.employeeManager) {
                case "View All Employees":
                    viewAll()
                    break;
                case "View All Employees By Department":
                    viewAllDepartment()
                    break;
                case "View All Employees By Manager":
                    viewAllManager()
                    break;
                case "Add Employee":
                    addEmployee()
                    break;
                case "Remove Employee":
                    removeEmployee()
                    break;
                case "Update Employee Role":
                    updateEmployeeRole()
                    break;
                case "Update Employee Manager":
                    updateEmployeeManager()
                    break;
                case "View All Roles":
                    viewAllRoles()
                    break;
                case "Add Role":
                    addRoles()
                    break;
                case "Remove Role":
                    removeRoles()
                    break;
                case "Exit":
                    connection.end()
                    break;
            }
        });
};

const viewAll = () => {
    console.log("------------------------------------------");
    console.log(roles);
    connection.query(`SELECT 
    e.id,
    CONCAT(e.first_name, ' ', e.last_name) AS 'Employee Name',
    r.title,
    d.name AS 'Department',
    r.salary,
    CONCAT(m.first_name, ' ', m.last_name) AS 'Manager'
    FROM employee e
    LEFT JOIN employee m
    ON e.manager_id = m.role_id
    JOIN roles r
    ON e.role_id = r.id
    JOIN department d
    ON r.department_id = d.id;`, (err, res) => {
        if (err) throw err;
        let data = res
        console.table(data);
        inquirer.prompt([{
            type: "list",
            name: "choices",
            message: "Would you like to go back to the main menu or exit?",
            choices: [
                "Main Menu",
                "Exit",
            ]
        }]).then(data => {
            switch (data.choices) {
                case "Main Menu":
                    start();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        })
    })
};

const viewAllDepartment = () => {
    console.log("------------------------------------------");
    connection.query(`SELECT 
    e.id,
    CONCAT(e.first_name, ' ', e.last_name) AS 'Employee Name',
    r.title,
    d.name AS 'Department'
    FROM employee e
    LEFT JOIN employee m
    ON e.manager_id = m.role_id
    JOIN roles r
    ON e.role_id = r.id
    JOIN department d
    ON r.department_id = d.id;`, (err, res) => {
        if (err) throw err;
        let data = res
        console.table(data);
        inquirer.prompt([{
            type: "list",
            name: "choices",
            message: "Would you like to go back to the main menu or exit?",
            choices: [
                "Main Menu",
                "Exit",
            ]
        }]).then(data => {
            switch (data.choices) {
                case "Main Menu":
                    start();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        })
    })
};

const viewAllManager = () => {
    console.log("------------------------------------------");
    connection.query(`SELECT 
    e.id,
    CONCAT(e.first_name, ' ', e.last_name) AS 'Employee Name',
    CONCAT(m.first_name, ' ', m.last_name) AS 'Manager'
    FROM employee e
    LEFT JOIN employee m
    ON e.manager_id = m.role_id
    JOIN roles r
    ON e.role_id = r.id
    JOIN department d
    ON r.department_id = d.id;`, (err, res) => {
        if (err) throw err;
        let data = res
        console.table(data);
        inquirer.prompt([{
            type: "list",
            name: "choices",
            message: "Would you like to go back to the main menu or exit?",
            choices: [
                "Main Menu",
                "Exit",
            ]
        }]).then(data => {
            switch (data.choices) {
                case "Main Menu":
                    start();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        })
    })
};

const addEmployee = () => {
    let newRoles = roles.map((role) => ({ name: role.role, value: role.roleId }));
    let newManager = managers.map((managers) => ({ name: managers.name, value: managers.managerId }));
    inquirer
        .prompt([{
                name: 'firstName',
                type: 'input',
                message: "What is the employee's first name?",
                validate: answer => {
                    if (answer !== "") {
                        return true;
                    } else {
                        return "Please enter at least one Character.";
                    }
                }
            },
            {
                name: 'lastName',
                type: 'input',
                message: "What is the employee's last name?",
                validate: answer => {
                    if (answer !== "") {
                        return true;
                    } else {
                        return "Please enter at least one Character.";
                    }
                }
            },
            {
                name: 'role',
                type: 'list',
                message: "What is the employee's role?",
                choices: newRoles,
            },
            {
                name: 'manager',
                type: 'list',
                message: "Who is the employee's manager?",
                choices: newManager,
            }
        ]).then((answer) => {
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.role,
                    manager_id: answer.manager,
                },
                (err, res) => {
                    if (err) throw err;
                    let data = res
                    console.table(data);
                    inquirer.prompt([{
                        type: "list",
                        name: "choices",
                        message: "Would you like to go back to the main menu or exit?",
                        choices: [
                            "Main Menu",
                            "Exit",
                        ]
                    }]).then(data => {
                        switch (data.choices) {
                            case "Main Menu":
                                start();
                                break;
                            case "Exit":
                                connection.end();
                                break;
                        }
                    })
                }
            )
        })
};

const removeEmployee = () => {

};

const updateEmployeeRole = () => {

};

const updateEmployeeManager = () => {

};

const viewAllRoles = () => {

};

const addRoles = () => {

};

const removeRoles = () => {

};


connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    start()
});