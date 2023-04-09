const { gql } = require('apollo-server-express');

exports.typeDefs = gql `
    type Employee {
        id: ID!
        firstname: String!
        lastname: String!
        email: String!
        gender: String!
        salary: Float!
    }

    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
    }

    type Message {
        message: String
        status: Boolean
        error: String
        employee: Employee
        user: User
    }

    type Query {
        getEmployees: [Employee]
        getEmployeeByID(id: ID!): Employee
        login(username: String!, password: String!): Message
    }

    type Mutation {
        addEmployee(
            firstname: String!
            lastname: String!
            email: String!
            gender: String!
            salary: Float!): Message

        updateEmployee(id: String!
            firstname: String!
            lastname: String!
            email: String!
            gender: String!
            salary: Float!): Message
        
        deleteEmployee(id: String!): Message

        signup(username: String!
            email: String!
            password: String!): Message
    }
`
