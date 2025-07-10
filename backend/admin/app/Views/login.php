<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <style>
        h1 {
            text-align: center;
            padding-top: 100px;
        }
        form#login {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 35%;
            margin: auto;
        }
        form#login input {
            /* width: 350px;       Chiều rộng mong muốn */
            padding: 12px 20px; /* Tăng khoảng đệm bên trong */
            font-size: large;    /* Tăng kích thước chữ */
            border: 1px solid gray; /* Thêm viền để dễ nhìn */
            border-radius: 5px; /* Bo góc nhẹ cho đẹp */
        }
        form#login button {
            /* width: 350px;       Chiều rộng mong muốn */
            padding: 12px 20px; /* Tăng khoảng đệm bên trong */
            font-size: large;    /* Tăng kích thước chữ */
            border: 1px solid gray; /* Thêm viền để dễ nhìn */
            border-radius: 5px; /* Bo góc nhẹ cho đẹp */
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h1>Login</h1>
    <form id="login">
        <input type="text" name="username" placeholder="User Name" autocomplete="username">
        <input type="password" name="password" placeholder="Password" autocomplete="new-password">
        <button type="submit">Login</button>
    </form>
</body>
</html>
