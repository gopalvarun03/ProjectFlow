document.addEventListener("DOMContentLoaded", function() {
    // OTP logic (if needed)
    const otpGroup = document.getElementById("otp-group");
    const emailInput = document.getElementById("email");
    const otpInputs = document.querySelectorAll(".otp-input");
    const resetButton = document.getElementById("reset-button");

    if (otpGroup) {
        // Initialize button state
        resetButton.disabled = true;

        // Display OTP input fields on pressing Enter in email input
        emailInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                if (emailInput.value.trim() !== "") {
                    otpGroup.style.display = "block";
                    otpInputs[0].focus(); // Focus first OTP input
                } else {
                    alert("Please enter your email first.");
                }
            }
        });

        // Check if all OTP inputs are filled and enable/disable the reset button
        function checkOtpFilled() {
            let allFilled = true;
            otpInputs.forEach(function(otpInput) {
                if (otpInput.value.length !== 1) {
                    allFilled = false;
                }
            });
            resetButton.disabled = !allFilled;
        }

        // Move focus to next OTP input on input
        otpInputs.forEach(function(input, index) {
            input.addEventListener("input", function() {
                if (input.value.length === 1 && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
                checkOtpFilled();
            });

            // Handle backspace, arrow keys, and deletion
            input.addEventListener("keydown", function(event) {
                if (event.key === "Backspace") {
                    if (input.value.length === 0 && index > 0) {
                        otpInputs[index - 1].focus();
                    } else {
                        input.value = ""; // Clear the current input value
                        event.preventDefault(); // Prevent the default backspace behavior
                    }
                    checkOtpFilled();
                } else if (event.key === "ArrowLeft" && index > 0) {
                    otpInputs[index - 1].focus();
                } else if (event.key === "ArrowRight" && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            });
        });

        // Handle clicking on RESET PASSWORD button
        // resetButton.addEventListener("click", function(event) {
        //     event.preventDefault();
        //     if (resetButton.disabled) {
        //         return; // If button is disabled, do nothing
        //     }

        //     // Redirect to reset_password.html
        //     window.location.href = "/reset";
        // });
    }
    
    // Reset Password Page logic
    const newPasswordInput = document.getElementById("new-password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const resetFormButton = document.querySelector(".reset-button");
    const errorMessage = document.getElementById("error-message");

    function checkPasswordsMatch() {
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (newPassword !== "" && confirmPassword !== "" && newPassword !== confirmPassword) {
            errorMessage.textContent = "Passwords do not match. Please try again.";
            errorMessage.style.display = "block";
            resetFormButton.disabled = true;
        } else {
            errorMessage.style.display = "none";
            resetFormButton.disabled = newPassword === "" || confirmPassword === "";
        }
    }

    newPasswordInput.addEventListener("input", checkPasswordsMatch);
    confirmPasswordInput.addEventListener("input", checkPasswordsMatch);

    document.getElementById("reset-password-form").addEventListener("submit", function(event) {
        event.preventDefault();
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (newPassword === confirmPassword) {
            // Simulate password reset (for demonstration)
            alert("Password reset successful!");
  
            location.href = "/login";

        }
    });
});
