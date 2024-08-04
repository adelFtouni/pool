<?php

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f0f2f5;
            font-family: Arial, sans-serif;
            margin: 0;
        }

        .signup-container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            width: 100%;
        }

        .signup-container h2 {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            color: #333;
        }

        .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }

        .form-group button {
            width: 100%;
            padding: 10px;
            background-color: darkblue;
            border: none;
            border-radius: 4px;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .form-group button:hover {
            background-color: darkblue;
        }

        .message {
            text-align: center;
            color: #d9534f;
            margin-top: 20px;
        }

        .login-link {
            text-align: center;
            margin-top: 20px;
        }

        .login-link a {
            text-decoration: none;
            color: darkblue;
        }
        a{
          text-decoration:none;
        }
    </style>
</head>
<body>
    <div class="signup-container">
        <h2>Sign Up</h2>
        <form id="signupForm">
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div class="form-group">
                <button type="button" onclick="signUp()">Sign Up</button>
            </div>
        </form>
        <div id="message" class="message"></div>
        <div class="login-link">
            <a href="login.php">Go to the Login page</a>
        </div>
    </div>

    <script>
        function signUp() {
            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;

            if (username && password) {
                const data = { username: username, password: password };

                fetch('adduser.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                       
                        window.location.href = 'login.php';
                    } else {
                        document.getElementById('message').innerHTML = data.message;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    document.getElementById('message').innerHTML = 'An error occurred. Please try again.';
                });
            } else {
                alert('Please enter valid details.');
            }
        }
    </script>
</body>
</html>

