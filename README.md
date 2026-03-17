# Messaging App API

This is a REST API for a messaging app. It allows users to send messages to each other either as DMs to a single user or in group chats with multiple users.

## Features

- User Authentication
- Profile Customization
- Sending DMs to users
- Creating of and sending messages in Group Channels

## Installation

1.  Clone the repository

    ```bash
    git clone git@github.com:LazyEllis/messaging-app.git
    ```

2.  Install the project's dependencies

    ```bash
    npm install
    ```

3.  Create a .env file and define environment variables

    ```env
    PORT=3000
    FRONTEND_URL="http://localhost:5173"
    DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<database>"
    TEST_DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<database>"
    JWT_SECRET=your_secret_key
    ```

4.  Run the database migrations and generate prisma

    ```bash
    npm run build
    ```

5.  Run the development server

    ```bash
    npm run dev
    ```

## License

The project is licensed under the [MIT](LICENSE) License.
