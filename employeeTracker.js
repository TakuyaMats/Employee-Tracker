const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');


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
            if (answer.employeeManager === 'View All Employees') {
                viewAll();
            } else if (answer.employeeManager === 'View All Employees By Department') {
                viewAllDepartment();
            } else if (answer.employeeManager === 'View All Employees By Manager') {
                viewAllManager();
            } else if (answer.employeeManager === 'Add Employee') {
                addEmployee();
            } else if (answer.employeeManager === 'Remove Employee') {
                removeEmployee();
            } else if (answer.employeeManager === 'Update Employee Role') {
                updateEmployeeRole();
            } else if (answer.employeeManager === 'Update Employee Manager') {
                updateEmployeeManager();
            } else if (answer.employeeManager === 'View All Roles') {
                viewAllRoles();
            } else if (answer.employeeManager === 'Add Role') {
                addRoles();
            } else if (answer.employeeManager === 'Remove Role') {
                removeRoles();
            } else {
                connection.end();
            }
        });
};



connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    start()
});