const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
let roles = require('./lib/role');
let managers = require('./lib/manager');
let department = require('./lib/department');

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
    let newRoles = roles.map((role) => ({
        name: role.role,
        value: role.roleId
    }));
    let newManager = managers.map((managers) => ({
        name: managers.name,
        value: managers.managerId
    }));
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
                'INSERT INTO employee SET ?', {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.role,
                    manager_id: answer.manager,
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} employee added!\n`);
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
    connection.query("SELECT * FROM employee", (err, employees) => {
        if (err) throw err;
        let removeEmployee = employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));
        inquirer
            .prompt([{
                name: 'remove',
                type: 'list',
                message: "Which employee would you like to remove?",
                choices: removeEmployee,
            }, ]).then((answer) => {
                connection.query("DELETE FROM employee WHERE ?", {
                        id: answer.remove,
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log(`${res.affectedRows} employee deleted!\n`);
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
            })
    })
};

const updateEmployeeRole = () => {
    connection.query("SELECT * FROM roles", (err, roles) => {
        if (err) throw err;
        let updateTitle = roles.map((role) => ({
            name: role.title,
            value: role.id,
        }));
        connection.query("SELECT * FROM employee", (err, employees) => {
            if (err) throw err;
            let updateEmployee = employees.map((employee) => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            }));
            inquirer
                .prompt([{
                        name: 'update',
                        type: 'list',
                        message: "Which employee would you like to update?",
                        choices: updateEmployee,
                    },
                    {
                        name: 'title',
                        type: 'list',
                        message: "What would you like to change your employee title to?",
                        choices: updateTitle,
                    },
                ]).then((answer) => {
                    connection.query("UPDATE employee SET ? WHERE ?",
                        [{
                                role_id: answer.title,
                            },
                            {
                                id: answer.update,
                            },
                        ],
                        (err, res) => {
                            if (err) throw err;
                            console.log(`${res.affectedRows} employee updated!\n`);
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
                })
        })
    })
}

const updateEmployeeManager = () => {
    connection.query("SELECT * FROM employee", (err, employees) => {
        if (err) throw err;
        let updateEmployee = employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));
        let newManager = managers.map((managers) => ({
            name: managers.name,
            value: managers.managerId
        }));
        inquirer
            .prompt([{
                    name: 'employee',
                    type: 'list',
                    message: "Which employee would you like to assign a new manager to?",
                    choices: updateEmployee,
                },
                {
                    name: 'manager',
                    type: 'list',
                    message: "Which manager would you like to assign your employee to?",
                    choices: newManager,
                },
            ]).then((answer) => {
                connection.query("UPDATE employee SET ? WHERE ?",
                    [{
                            manager_id: answer.manager,
                        },
                        {
                            id: answer.employee,
                        },
                    ],
                    (err, res) => {
                        if (err) throw err;
                        console.log(`${res.affectedRows} employee manager updated!\n`);
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
            })
    })
};

const viewAllRoles = () => {
    console.log("------------------------------------------");
    connection.query(`SELECT roles.id, roles.title, roles.salary FROM roles`, (err, res) => {
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

const addRoles = () => {
    connection.query("SELECT * FROM department", (err, departments) => {
        if (err) throw err;
        let addInDepartment = departments.map((department) => ({
            name: department.name,
            value: department.departmentId,
        }));
        inquirer
            .prompt([{
                    name: 'role',
                    type: 'input',
                    message: "Please provide the new role you would like to add.",
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: "Please provide a salary to go with the new role.",
                },
                {
                    name: 'department',
                    type: 'list',
                    message: "Please select the department you want the role be added to",
                    choices: addInDepartment,
                }
            ]).then((answer) => {
                connection.query(
                    'INSERT INTO roles SET ?', 
                        {
                            title: answer.role,
                            salary: answer.salary,
                            department_id: answer.department,
                        },
                    (err, res) => {
                        if (err) throw err;
                        console.log(`${res.affectedRows} role added!\n`);
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
    })
};

const removeRoles = () => {
    connection.query("SELECT * FROM roles", (err, roles) => {
        if (err) throw err;
        let removeRoles = roles.map((role) => ({
            name: role.title,
            value: role.id,
        }));
        inquirer
            .prompt([{
                name: 'remove',
                type: 'list',
                message: "Which role would you like to remove?",
                choices: removeRoles,
            }, ]).then((answer) => {
                connection.query("DELETE FROM roles WHERE ?", {
                        id: answer.remove,
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log(`${res.affectedRows} role deleted!\n`);
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
            })
    })
};

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    start()
});