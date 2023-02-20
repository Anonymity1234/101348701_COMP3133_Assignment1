const User = require('./models/userModel');
const Employee = require('./models/employeeModel');
const { GraphQLError } = require('graphql');


exports.resolvers = {
    Query: {
        getEmployees: async (parent, args) => {
            const employees = await Employee.find()
            if(employees.length < 1) throw new Error("There are no employees in the database!")
            return employees
        },
        getEmployeeByID: async (parent, args) => {
            const emp = await Employee.findById({_id: args.id})
            if (!emp) throw new Error("Employee not found.")
            return emp
        },
        login: async (parent, args) => {
            let user = await User.findOne({username: args.username})
            if (!user) throw new Error ("Please check the provided username and password as the credentials could not be verified.")
            const isMatch = await new Promise((resolve, reject) => {
                user.verifyPassword(args.password, (err, isMatch) => {
                    if (err) reject(err);
                    resolve(isMatch);
                });
            });
            console.log(isMatch)
            if (!isMatch) throw new Error("Please check the provided username and password as the credentials could not be verified.")
            return user;
        }
    },

    Mutation: {
        addEmployee: async (parent, args) => {
            let newEmp = new Employee(args)
            let empResult = await newEmp.save()
            if (!empResult) throw new Error("Employee was not created.")
            return empResult
        },
        register: async (parent, args) => {
            let newUser = new User(args)
            let userResult = await newUser.save()
            if (!userResult) throw new Error("User was not created.")
            return userResult
        },
        updateEmployee: async (parent, args) => {
            const employee = await Employee.findByIdAndUpdate(args.id, args, { new: true });
            if (!employee) {
                throw new Error("The update of the employee was unsuccessful.");
            }
            return employee;
        },
        deleteEmployee: async (parent, args) => {
            console.log(args.id)
            const result = await Employee.findByIdAndDelete(args.id);
            console.log(result)
            if (!result) {
                throw new Error("The deletion of the user was unsuccessful.");
            }
            return "User deleted successfully."
        }
    }
}