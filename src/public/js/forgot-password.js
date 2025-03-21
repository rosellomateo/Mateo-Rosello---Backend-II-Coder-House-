document.getElementById("forgot-password-form").addEventListener("submit", async (event) => {
    event.preventDefault()

    const email = document.getElementById("email").value
    const messageElement = document.getElementById("message")

    try {
        const response = await fetch("../api/sessions/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        })

        const result = await response.json()
        if (response.ok) {
            messageElement.textContent = "Se ha enviado un enlace de recuperación a tu correo."
            messageElement.style.color = "green"
        } else {
            throw new Error(result.message || "Error al enviar el correo.")
        }
    } catch (error) {
        messageElement.textContent = error.message
        messageElement.style.color = "red"
    }
})
