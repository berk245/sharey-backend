### Prerequisites

- Node.js version 14 or higher
- MySQL version 8 or higher

### Installation

1. Clone the [repository](https://github.com/berk245/sharey-backend/tree/create-user-feature) using Git:

    ```
    git clone https://github.com/berk245/sharey-backend.git
    ```

2. Navigate to the project directory and install dependencies:

    ```
    cd sharey-backend
    npm install
    ```

3. Create a `.env` file in the root of the project folder with the following info that has CRUD access to the database:

    ```
    MYSQL_DATABASE=sharey_local
    MYSQL_USER=fatma
    MYSQL_PASSWORD=reassessment
    MYSQL_HOST=localhost
    MYSQL_SOCKET_PATH=<path/to/your/mysql_socket>
    ```

    To find your MySQL socket path, you can run the following command in your terminal:

    ```
    mysql_config --socket
    ```

    This will print the location of your MySQL socket. You can add this path to the `MYSQL_SOCKET_PATH` environment variable in your `.env` file.

    The `MYSQL_SOCKET_PATH` environment variable is needed in case you have multiple MySQL installations in your machine and need to specify the socket path explicitly in order to connect to the database. If you do not have this issue, you can remove this line from the `.env` file and the corresponding line in the code.

4. Create the database in MySQL:

    ```
    mysql -u [username] -p -e "CREATE DATABASE [database]"
    ```

    Replace **`[username]`** with your MySQL username and **`[database]`** with the desired name for your database.

5. Download the database dump file from [this folder](https://drive.google.com/drive/folders/19C-ue5bGFOLaRGLFFo5iXEvLQnmwV2Sh?usp=sharing) and import the database:

    ```
    mysql -u [username] -p [database] < [path-to-dump-file]
    ```

6. Start the application:

    ```
    npm run dev
    ```

### Testing

For conveniently testing endpoints, I created a Postman collection. You can access it via [this link](https://api.postman.com/collections/10896115-d224bd38-1f83-4ebf-891e-8d414cb1a70c?access_key=PMAT-01H6K8NNHYC0VRFEYVTT6JSE79). To add the collection, go to Postman and click the **Import** button and paste the link to the bar.



