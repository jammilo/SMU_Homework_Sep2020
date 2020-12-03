--1.List the following details of each employee: employee number, last name, first name, sex, and salary.

SELECT e.emp_no as "employee number",
	   e.last_name as "last name",
	   e.first_name as "first name",
	   e.sex as "gender",
	   s.salary as "Salary"
FROM employees e
Join salaries s on e.emp_no = s.emp_no;

--2.List first name, last name, and hire date for employees who were hired in 1986.

SELECT first_name as "first name",
       last_name as "last name",
	   hire_date as "hire date"
FROM employees
WHERE hire_date BETWEEN '1986-01-01' AND '1986-12-31'
ORDER BY hire_date asc;


--3.List the manager of each department with the following information: 
--department number, department name, the manager's employee number, last name, first name.

SELECT d.dept_no as "department number",
	   d.dept_name as "department name",
	   dm.emp_no as "manager employee number",
	   e.last_name as "last name",
	   e.first_name as "first name"
FROM dept_manager dm
Join employees e on e.emp_no = dm.emp_no
Join departments d on d.dept_no = dm.dept_no;



--4.List the department of each employee with the following information: 
--employee number, last name, first name, and department name.

SELECT e.emp_no as "employee number",
	   e.last_name as "last name",
	   e.first_name as "first name",
	   d.dept_name as "department name"
FROM employees e
Join dept_emp de on de.emp_no = e.emp_no
Join departments d on d.dept_no = de.dept_no;


--5.List first name, last name, and sex for employees whose first name is "Hercules" and last names begin with "B."

SELECT first_name as "first name",
	   last_name as "last name",
	   sex as "sex"
FROM employees
WHERE first_name = 'Hercules'
AND last_name like 'B%';


--6.List all employees in the Sales department, including their employee number, last name, first name, and department name.

SELECT e.emp_no as "employee number",
	   e.last_name as "last name",
	   e.first_name as "first name",
	   d.dept_name as "department name"
FROM employees e
JOIN dept_emp de on de.emp_no = e.emp_no
JOIN departments d on d.dept_no = de.dept_no
WHERE dept_name = 'Sales'
ORDER BY e.emp_no asc;


--7.List all employees in the Sales and Development departments, 
--including their employee number, last name, first name, and department name.

SELECT e.emp_no as "employee number",
	   e.last_name as "last name",
	   e.first_name as "first name",
	   d.dept_name as "department name"
FROM employees e
JOIN dept_emp de on de.emp_no = e.emp_no
JOIN departments d on d.dept_no = de.dept_no
WHERE dept_name = 'Sales' or dept_name = 'Development'
ORDER BY e.emp_no asc;


--8.In descending order, list the frequency count of employee last names, i.e., how many employees share each last name.

SELECT last_name as "last name",
	   count(*) as "frequency Counts"
FROM employees
GROUP BY "last name"	
ORDER BY "frequency Counts" desc;

--Epilogue:"Search your ID number." You look down at your badge to see that your employee ID number is 499942.

SELECT first_name as "first name",
	   last_name as "last name",
	   emp_no as "ID number"
FROM employees
WHERE emp_no = '499942';


