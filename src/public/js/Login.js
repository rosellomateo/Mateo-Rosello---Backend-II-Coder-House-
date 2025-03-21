document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("form")

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault()

        const formData = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        }

        try {
            const response = await fetch("../api/sessions/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            const result = await response.json()
            if (response.ok) {
                alert("Inicio de sesión exitoso.")
                window.location.href = "/"  
                alert(result.message || "Error en el inicio de sesión")
            }
        } catch (error) {
            console.error("Error en la solicitud:", error)
            alert("Hubo un problema con el inicio de sesión.")
        }
    })
})