# T A S K / / F L O W

TaskFlow is a project and task management application designed to optimize collaboration and access control between users. The app allows administrators to register new users and manage roles, ensuring that each person has the appropriate level of access to projects and tasks.

With TaskFlow, users can efficiently create, update, and delete projects and tasks, while administrators can assign specific access levels, to ensure that only authorized people make critical modifications. The application also implements a secure authentication system, protecting access and ensuring that each operation is performed by authenticated users.

> [!IMPORTANT]
> This project is still in development

# Data Model Structure

The system's data model consists of four interconnected entities. These entities are linked through foreign keys, defining their relationships and ensuring referential integrity within the database.

![Models](/img/ModelsDB.jpg)

## Cardinal Relationships

The following diagram provides a higher-level view of the cardinal relationships between the models, focusing on the logical associations such as one-to-many and many-to-one.

![Models](/img/ArchDB.jpg)

# Application Workflow

This diagram illustrates the application's logic flow, including user authentication, role-based access control, and task management processes.

![Models](/img/AppArch.jpg)

## Install

```bash

# start the date base
$ docker-compose up db

# install the node modules 
$ npm install

# migrate the entities to date base
$ npm run m:gen -- ./migrations/init

# start the entities in date base
$ npm run m:run

# start the server
$ npm run start:dev

```

## Testing

``` bash
$ npm start test:watch
```
## Documentation Swagger

[3001/docs](http://localhost:3001/docs/)

## Author 

Dario Marzzucco 