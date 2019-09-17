# mongo-viz

Lightweight MongoDB visualizer built with React and Express.

Note: I mostly use this app for visualization and database clean-up.  
Scope of actions is currently limited to collection creation/deletion and document deletion.

## Connecting

Username/password authentication is required.

```
node app -H [hostname] -N [port] -U [username] -P [password] -D [database]
```

Server configuration & credentials can also be stored as a configFile.json and initialized with:

```
node app -C
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
