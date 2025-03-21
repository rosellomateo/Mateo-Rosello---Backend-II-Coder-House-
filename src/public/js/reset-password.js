document.getElementById("reset-password-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = document.getElementById("token").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const messageElement = document.getElementById("message");

    if (password !== confirmPassword) {
        messageElement.textContent = "Las contraseñas no coinciden.";
        messageElement.style.color = "red";
        return;
    }

    try {
        const response = await fetch(`../api/sessions/reset-password/${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });

        const result = await response.json();
        if (response.ok) {
            messageElement.textContent = "Contraseña restablecida correctamente.";
            messageElement.style.color = "green";
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
        } else {
            throw new Error(result.message || "Error al restablecer la contraseña.");
        }
    } catch (error) {
        messageElement.textContent = error.message;
        messageElement.style.color = "red";
    }
});
