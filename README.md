# NodeJS Project Setup

## Dependencies

1. bcrypt
2. cookie-parser
3. cors
4. dotenv
5. express
6. jsonwebtoken
7. mongoose
8. uuid

## DevDependencies

1. nodemon

## Tree Structures

-   :root
    -   **.vscode**
        -   settings.json
    -   **config**
        -   allowedOrigins.js
        -   corsOptins.js
        -   dbConn.js
        -   roles_list.js
    -   **controllers**
        -   authController.js
        -   employeesController.js
        -   logoutController.js
        -   refreshTokenController.js
        -   registerController.js
    -   **logs**
        -   errLog.txt
        -   reqLog.txt
    -   **middleware**
        -   credentials.js
        -   errorHandler.js
        -   logEvents.js
        -   verifyJWT.js
        -   verifyRoles.js
    -   **model**
        -   Employee.js
        -   User.js
    -   **public**
        -   **css**
        -   **img**
        -   **text**
    -   **routes**
        -   **api**
            -   employees.js
        -   auth.js
        -   logout.js
        -   refresh.js
        -   register.js
        -   root.js
    -   **views**
        -   404.html
        -   index.html
    -   .env
    -   .gitignore
    -   .prettierrc
    -   index.js
    -   package-lock.json
    -   package.json
