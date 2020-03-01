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

## Before you begin
Docker Swarm was chosen largely because it is easy to use and supports secrets management. You will need two secrets: one is a MongoDB connection URI that Mongoose will use to connect to your MongoDB instance and the other is an arbitrary key that the API server will use to generate and validate JWTs (to be clear, the JWT key can be any string you want, but longer is better). The Mongo URI should look something like this 

```mongodb+srv://<username>:<password>@cluster0-rthhi.azure.mongodb.net/test?retryWrites=true&w=majority```

If you do not have a MongoDB server avaialable, you can quickly create one for free at <a href="https://cloud.mongodb.com/">MongoDB Atlas</a>. You will also need to install Docker on whatever host OS you're using. I will leave that as an exercise for the reader. 

## Clone the repo

```git clone https://github.com/mbenedix/runninglog.git```

The rest of the commands in this tutorial should be run out of the runninglog directory created by this command. 

## Create a Docker Swarm

First, we will put our Docker engine in Swarm mode and create a single node Swarm. Depending on your Docker setup, you may need to run these commands as root.

```docker swarm init```

## Build the images

Because Docker Swarm works off of images rather than dockerfiles, we need to build our images. From the runninglog directory, we will build both images and tag them to facilitate pushing to a container registry. 

For the purposes of this tutorial, we will be tagging to push to a registry running on localhost. Feel free to tag them differently if you'd like to use something like Azure Container Registry or Docker Hub. If you do tag them differently, you will need to change the image values in the docker-stack.yml file. 

```docker build ./client/ -t localhost:5000/frontend && docker build ./api/ -t localhost:5000/backend```

## Create local registry and push to it

We will create a local registry on our Swarm and then push our new images onto it. This is necessary in order to use Docker Stacks. 

```docker service create --name registry --publish mode=host,published=5000,target=5000 registry:2```

Check that your registry is running with 

```docker service ls```

Now we push our images to the new local registry.

```docker push localhost:5000/frontend && docker push localhost:5000/backend```

## Create secrets 

We will enter our secrets into Docker Swarm. This allows for secure injection of the secrets into the container at run time. Our two secrets are the MongoDB URI and the JWT key. These secrets will be injected into the container in the /run/secrets/ directory where the API server will read them from a file.  

```echo '<your mongodb uri>' | docker secret create mongo_uri -```

```echo '<your jwtkey >' | docker secret create jwtkey -```

## Deploy the stack

We are ready to deploy. 

```docker stack deploy -c docker-stack.yml runninglog```

I hope that worked. You can view the state of this stack by running 

```docker stack ps runninglog```

You can trace this down to the services and containers created by running the following commands 

```docker service ls```

```docker container ls```

## Use the app

You should now be able to go to http://localhost and view the app. If this is your first time using the app, you will need to create an account and login before being able to do anything interesting. 

## Troubleshooting 

There are a lot of places where things could go wrong and I only tested this on Ubuntu 19.10 with Docker installed from the Docker repo. I will highlight a few areas that I believe are the largest friction points. 

### Docker Stack deployment stuck at 0/1 replicas for each service

This is a known issue with Docker installed using Snap. It has trouble writing to /var/lib/docker under certain circumstances. Remove the Snap and install Docker another way. 

### API server is failing or throwing errors

It's probably an issue with secrets. Go into the container and check /run/secrets/jwtkey and /run/secrets/mongo_uri and ensure that they exist and are formatted correctly. You can change the source to hardcode the values there, rebuild the images, and run the image as an individual container to test this as well. 

### Servers are working but not working together

It's probably a docker networking issue. Ensure that your host is listening on both ports 80 and 9000. Ensure that the frontend container is listening on 80 and the backend container is listening on 9000. I attempted to make the application communicate through those ports on localhost. If something on localhost is already binding to those ports, this will cause the deployment to fail. 
