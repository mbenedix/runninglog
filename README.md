# runninglog

This is a running log app built to learn basic MERN stack web development. 
         
It allows you to create an account, login with that account, log runs, and view data from those runs. 
Because the intent of the project was to learn basic web dev, nothing particularly novel is done with the data. 
It does allow you to filter and sort the data which can provide insights of value when used with the simple
aggregate statistics provided. 
         
The frontend is built with React with hooks. The backend API server is built with Node and Express. 
Data storage is accomplished with MongoDB and Mongoose. Authentication is done with JSON Web Tokens.
It is intended to be deployed using Docker Swarm.   

# Deployment with Docker Swarm

## Before You Begin
Docker Swarm was chosen largely because it is easy to use and supports secrets management. Before you begin, you will need two secrets: 1 is a MongoDB connection URI that Mongoose will use to connect to your MongoDB instance and the other is an arbitrary key that the API server will use to generate and validate JWTs. The Mongo URI should look something like this 
```mongodb+srv://<username>:<password>@cluster0-rthhi.azure.mongodb.net/test?retryWrites=true&w=majority```

If you do not have a MongoDB server avaialable, you can quickly create one for free at <a href="https://cloud.mongodb.com/">MongoDB Atlas</a>. 

