# SKILLS DEVELOPING
```JSON
{
    "compilerOptions": {
    // WHERE I WILL USE MY CODE, SYSTEM,BROWSER, ETC...
      "module": "common.js",
    // If i didn't select a type, will set it ANY
      "noImplicitAny": true,  
      "removeComments": true,
      "preserveConstEnums": true,
      "outDir": "dist",
    // Create .map files?
      "sourceMap": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "**/*.spec.ts"]
  }
```

## USERS
  `GET /users` - List of users
  `POST / users` - Create new user
  `GET /users/:id` - get user by ID
  `PUT /users/:id` - Update user by ID
  `DELETE /users/:id` - Delete user by ID