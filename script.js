document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('supportForm');
    const fileInput = document.getElementById('attachment');
    const fileInputLabel = document.querySelector('.file-input-label');
    const formFields = document.querySelectorAll('input, select, textarea');

    // Manejar el envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            alert('Formulario enviado con éxito. Se ha enviado un correo de confirmación.');
            form.reset();
            resetFileInput();
        }
    });

    // Manejar el cambio en el input de archivo
    fileInput.addEventListener('change', function(e) {
        const fileName = e.target.files[0]?.name || 'Adjuntar archivo (Max. 5MB)';
        fileInputLabel.textContent = fileName;
    });

    // Verificar si los campos ya tienen valor para mover la etiqueta al cargar la página
    formFields.forEach(field => {
        if (field.value.trim() !== '') {
            const label = field.nextElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.classList.add('active');
            }
        }

        // Mover la etiqueta cuando el campo se enfoca o se desenfoca
        field.addEventListener('focus', () => {
            const label = field.nextElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.classList.add('active');
            }
        });

        field.addEventListener('blur', () => {
            if (field.value.trim() === '') {
                const label = field.nextElementSibling;
                if (label && label.tagName === 'LABEL') {
                    label.classList.remove('active');
                }
            }
        });
    });

    // Validar el formulario
    function validateForm() {
        let isValid = true;
        const fields = [
            { id: 'fullName', error: 'fullNameError', message: 'El nombre es obligatorio' },
            { id: 'email', error: 'emailError', message: 'Ingrese un correo electrónico válido', validator: isValidEmail },
            { id: 'phone', error: 'phoneError', message: 'Ingrese un número de teléfono válido', validator: isValidPhone, optional: true },
            { id: 'serviceType', error: 'serviceTypeError', message: 'Seleccione un tipo de servicio' },
            { id: 'description', error: 'descriptionError', message: 'La descripción es obligatoria' },
            { id: 'contactMethod', error: 'contactMethodError', message: 'Seleccione un método de contacto' }
        ];

        fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (!field.optional && !element.value.trim()) {
                showError(field.error, field.message);
                isValid = false;
            } else if (field.validator && element.value.trim() && !field.validator(element.value)) {
                showError(field.error, field.message);
                isValid = false;
            } else {
                hideError(field.error);
            }
        });

        // Validar archivo adjunto
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            if (file.size > 5 * 1024 * 1024) {
                showError('attachmentError', 'El archivo no debe superar los 5MB');
                isValid = false;
            } else if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
                showError('attachmentError', 'Formato de archivo no permitido');
                isValid = false;
            } else {
                hideError('attachmentError');
            }
        }

        // Validar reCAPTCHA
        if (!grecaptcha.getResponse()) {
            alert('Por favor, complete el reCAPTCHA');
            isValid = false;
        }

        return isValid;
    }

    // Funciones auxiliares
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        return /^\+?[\d\s()-]{7,}$/.test(phone);
    }

    function showError(id, message) {
        const errorElement = document.getElementById(id);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function hideError(id) {
        const errorElement = document.getElementById(id);
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    function resetFileInput() {
        fileInput.value = '';
        fileInputLabel.textContent = 'Adjuntar archivo (Max. 5MB)';
    }
});

