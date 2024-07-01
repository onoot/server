
// Function to handle user login
async function reg(object) {
    try {
        const { email, firstName, gender, lastName, password, passwordConfirmation } = object;

        const response = await fetch(`api/auth/registration`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                firstName: firstName,
                gender: gender,
                lastName: lastName,
                password: password,
                passwordConfirmation: passwordConfirmation
            })
        });
        let resLog;
        if (response) {
            resLog = await log(email, password);
        }
        if (resLog)
            return true;

    } catch (error) {
        console.log('Login error: ' + error);
        resLog = await log(email, password);
        if (resLog)
            return true;
        else
            return false;
    }
};

async function log(email, password) {
    try {
        const response = await fetch(`api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.token;

            // Устанавливаем токен в localStorage
            localStorage.setItem('token', token);

            // Используйте токен для отправки запросов на защищенные ресурсы
            // Например, добавьте токен в заголовки запросов
            // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log('Error in log function: ' + error);
        return false;
    }
}

// Function to handle user logout
const logout = () => {
    // Remove token from localStorage or sessionStorage
};
