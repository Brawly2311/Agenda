document.addEventListener('DOMContentLoaded', function() {
    const apiURL = 'http://www.raydelto.org/agenda.php';
    const contactListDiv = document.getElementById('contact-list');
    const toggleContactsBtn = document.getElementById('toggle-contacts-btn');

    // Función para cargar los contactos desde la API
    function loadContacts() {
        fetch(apiURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Datos recibidos de la API:', data);
                const contactsTableBody = document.getElementById('contacts');
                contactsTableBody.innerHTML = '';  // Limpiar la lista antes de cargar los nuevos contactos
                data.forEach(contact => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${contact.nombre}</td>
                        <td>${contact.apellido}</td>
                        <td>${contact.telefono}</td>
                    `;
                    contactsTableBody.appendChild(row);
                });
                toggleContactsBtn.textContent = 'Ocultar Contactos';
            })
            .catch(error => {
                console.error('Error al cargar los contactos:', error);
                alert('Error al cargar los contactos. Por favor, intenta de nuevo.');
            });
    }

    // Función para mostrar/ocultar los contactos
    toggleContactsBtn.addEventListener('click', function() {
        if (contactListDiv.style.display === 'none' || contactListDiv.style.display === '') {
            contactListDiv.style.display = 'block';  // Mostrar contactos
            loadContacts();  // Cargar los contactos cuando se despliegan
        } else {
            contactListDiv.style.display = 'none';  // Ocultar contactos
        }
        toggleContactsBtn.textContent = contactListDiv.style.display === 'none' ? 'Mostrar Contactos' : 'Ocultar Contactos';
    });

    // Función para agregar un nuevo contacto
    document.getElementById('new-contact-form').addEventListener('submit', function(e) {
        e.preventDefault();

        // Obtener los datos del formulario
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const telefono = document.getElementById('telefono').value;

        // Crear un objeto con los datos del nuevo contacto
        const newContact = {
            nombre: nombre,
            apellido: apellido,
            telefono: telefono
        };

        // Verifica qué se está enviando
        console.log('Enviando nuevo contacto:', newContact);

        // Enviar el nuevo contacto a la API
        fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newContact)
        })
        .then(response => {
            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                console.error('Error en la respuesta:', response);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta de la API:', data);
            alert('Contacto agregado con éxito');
            loadContacts();  // Recargar los contactos después de agregar uno nuevo
            document.getElementById('new-contact-form').reset();  // Limpiar el formulario
        })
        .catch(error => {
            console.error('Error al agregar el contacto:', error);
            alert('Error al agregar el contacto. Por favor, intenta de nuevo.');
        });
    });
});
