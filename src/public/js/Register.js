document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector("form")

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault()

        const password = document.getElementById("password").value
        const confirmPassword = document.getElementById("confirmPassword").value
        
        const formData = {
            first_name: document.getElementById("firstName").value,
            last_name: document.getElementById("lastName").value,
            email: document.getElementById("email").value,
            age: document.getElementById("age").value,
            username: document.getElementById("username").value,
            password: password,

        }

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden")
            return
        }

        try {
            const response = await fetch("../api/sessions/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            const result = await response.json()
            if (response.ok) {
                alert("Registro exitoso, ahora puedes iniciar sesión.")
                window.location.href = "/login"
            } else {
                alert(result.message)
            }
        } catch (error) {
            console.error("Error en la solicitud:", error)
            alert("Hubo un problema con el registro.")
        }
    })
})