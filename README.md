# mongo-viz

Lightweight MongoDB visualizer built with React and Express.

Note: I mostly use this app for visualization and database clean-up.  
Scope of actions is currently limited to collection creation/deletion and document deletion.

## Connecting

Credentials should be stored in config.json in the following format:

```
{
  database: [mongoURI, databaseID]
}

```

The app can be started with the command:

```
node app -D <database>
```

## Database View

![Database View](https://raw.githubusercontent.com/forrestzhang107/mongo-viz/master/images/database.png)

## Collection View

![Collection View](https://raw.githubusercontent.com/forrestzhang107/mongo-viz/master/images/collection.png)

## Features

* Secure - Credentials are not stored anywhere
* Visualize - Explore collections and documents
* Query, sort, and delete documents
* Create or drop collections
* Lightning fast, lightweight, and responsive design
