const express = require('express');
const { resolve } = require('path');

const app = express();
let { sequelize } = require('./lib/index');
let { employee } = require('./models/employee.model');

let employeesData = [
  {
    id: 1,
    name: 'Alice',
    salary: 60000,
    department: 'Engineering',
    designation: 'Software Engineer',
  },
  {
    id: 2,
    name: 'Bob',
    salary: 70000,
    department: 'Marketing',
    designation: 'Marketing Manager',
  },
  {
    id: 3,
    name: 'Charlie',
    salary: 80000,
    department: 'Engineering',
    designation: 'Senior Software Engineer',
  },
];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    await employee.bulkCreate(employeesData);

    return res.status(200).json({ message: 'Database seeding successfull' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error seeding the data', error: error.message });
  }
});

//Function to fetch all the employees in the database
async function fetchAllEmployees() {
  let response = await employee.findAll();
  return { employees: response };
}

//Endpoint 1: Fetch all employees
app.get('/employees', async (req, res) => {
  try {
    let result = await fetchAllEmployees();

    if (result.employees.length === 0) {
      return res.status(404).json({ message: 'No employees found' });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch employees by ID
async function fetchEmployeeById(id) {
  let response = await employee.findOne({ where: { id } });
  return { employee: response };
}

//Endpoint 2: Fetch employee details by ID
app.get('/employees/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    let result = await fetchEmployeeById(id);

    if (result.employee.length === 0) {
      return res.status(404).json({ message: 'No employees found' });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch all the employees in a department
async function fetchEmployeesByDepartment(department) {
  let response = await employee.findAll({ where: { department } });
  return { employees: response };
}

//Endpoint 3: Fetch all employees by department
app.get('/employees/department/:department', async (req, res) => {
  let department = req.params.department;
  try {
    let result = await fetchEmployeesByDepartment(department);

    if (result.employees.length === 0) {
      return res.status(404).json({ message: 'No employees found' });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch all the employees sorted by their salary
async function sortEmployeesBySalary(order) {
  let response = await employee.findAll({ order: [['salary', order]] });
  return { employees: response };
}

//Endpoint 4: Sort all the employees by their salary
app.get('/employees/sort/salary', async (req, res) => {
  let order = req.query.order;
  try {
    let result = await sortEmployeesBySalary(order);

    if (result.employees.length === 0) {
      return res.status(404).json({ message: 'No employees found' });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
