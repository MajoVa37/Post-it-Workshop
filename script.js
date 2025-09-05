const noteInput = document.getElementById('new-note-input');
const addButton = document.getElementById('add-note-button');
const notesContainer = document.getElementById('notes-container');
const toggleThemeButton = document.getElementById('toggle-theme-button');
const body = document.body;
const colors = ['note-yellow', 'note-blue', 'note-pink'];

function createNoteElement(text, colorClass) {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note', colorClass); 
    noteDiv.textContent = text;

    /**
     * Es el boton que permite eliminar una nota
     */
    const deleteButton = document.createElement('span');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'x';

    noteDiv.appendChild(deleteButton);
    return noteDiv;
}

//**Esta funcion permite guardar los post-it */
function saveNotes() {
    const notes = [];
    document.querySelectorAll('.note').forEach(note => {
        if (!note.classList.contains('editing')) {
            notes.push({
                text: note.childNodes[0].nodeValue,
                color: note.classList[1]
            });
        }
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}

//**Esta funcion permite cargar los post-it */
function loadNotes() {
    notesContainer.innerHTML = '';
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
        const notes = JSON.parse(storedNotes);
        notes.forEach(noteData => {
            const newNote = createNoteElement(noteData.text, noteData.color);
            notesContainer.appendChild(newNote);
        });
    }
}
//**Esta funcion permite establecer el modo del landing (claro u oscuro) */
function setInitialTheme() {
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    if (isDarkMode) {
        body.classList.add('dark-mode');
        toggleThemeButton.textContent = 'Modo Claro';
    }
}

//**Estos son los que permiten la interaccion con los post-it */
noteInput.addEventListener('input', () => {
    addButton.disabled = noteInput.value.trim() === '';
});

//**Este es el boton que permite cambiar el modo del landing (claro u oscuro) */
toggleThemeButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('isDarkMode', isDarkMode);
    toggleThemeButton.textContent = isDarkMode ? 'Modo Claro' : 'Modo Oscuro';
});

//**Este permite editar los post-it */
notesContainer.addEventListener('dblclick', (event) => {
    const target = event.target;
    if (target.classList.contains('note')) {
        const currentText = target.textContent.slice(0, -1);
        target.textContent = '';
        target.classList.add('editing');

//**Este es el que permite editar el post-it */
        const textarea = document.createElement('textarea');
        textarea.value = currentText;
        target.appendChild(textarea);
        textarea.focus();

//**Esta funcion permite guardar la edicion del post-it */
        function saveEdit() {
            const newText = textarea.value.trim();
            target.textContent = newText;
            target.classList.remove('editing');

//**Este es el boton que permite eliminar el post-it */
            const deleteButton = document.createElement('span');
            deleteButton.classList.add('delete-btn');
            deleteButton.textContent = 'x';
            target.appendChild(deleteButton);

            saveNotes();
        }

//**Estos son los que permiten guardar la edicion del post-it */
        textarea.addEventListener('blur', saveEdit);
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEdit();
            }
        });
    }
});

//**Este es el boton que permite añadir un nuevo post-it */
addButton.addEventListener('click', () => {
    const noteText = noteInput.value.trim();
    if (noteText !== '') {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const newNote = createNoteElement(noteText, randomColor);
        notesContainer.appendChild(newNote);
        noteInput.value = '';
        addButton.disabled = true;
        saveNotes();
    }
});

//**Este es el boton que permite eliminar un post-it */
notesContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        event.target.parentElement.remove();
        saveNotes();
    }
});

//**Estos son los que permiten dar un efecto hover a los post-it */
notesContainer.addEventListener('mouseover', (event) => {
    if (event.target.classList.contains('note')) {
        event.target.style.boxShadow = '0 0 15px rgba(0,0,0,0.3)';
    }
});

//**Estos son los que permiten quitar el efecto hover a los post-it */
notesContainer.addEventListener('mouseout', (event) => {
    if (event.target.classList.contains('note')) {
        event.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }
});

setInitialTheme();
loadNotes();