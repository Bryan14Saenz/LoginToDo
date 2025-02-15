'use strict';

$(function () {
  // Constantes
  const fragment: DocumentFragment = document.createDocumentFragment();
  const IDBRequest = indexedDB.open('Usuarios', 1);
  const IDBRequest2 = indexedDB.open('Tareas', 1);
  let db: IDBDatabase;

  // Funciones
  IDBRequest.addEventListener('upgradeneeded', (e) => {
    const target = e.target as IDBOpenDBRequest;

    if (target) {
      const db = target.result;

      if (!db.objectStoreNames.contains('Usuarios')) {
        db.createObjectStore('Usuarios', { autoIncrement: true });
      }
    }
  });

  IDBRequest.addEventListener('success', (e) => {
    const target = e.target as IDBOpenDBRequest;

    if (target) {
      db = target.result;
    }
  });

  IDBRequest.addEventListener('error', (e) => {
    const target = e.target as IDBOpenDBRequest;

    console.error('Error al abrir la base de datos', target.error);
  });

  const addUsuario = (usuario = {}) => {
    if (!db) {
      console.error('No se ha abierto la base de datos');
      return;
    }

    const transaction = db.transaction('Usuarios', 'readwrite');
    const store = transaction.objectStore('Usuarios');

    const request = store.add(usuario);

    request.addEventListener('success', (e) => {
      alert('Usuario agregado');
    });

    request.addEventListener('error', (e) => {
      const target = e.target as IDBRequest;

      console.error('Error al agregar el cliente', target.error);
    });
  };

  const inicioSesión = () => {
    const section = document.createElement('section');

    section.id = 'inicioSesión';
    section.innerHTML = `
      <div class="inicioSesión-img"></div>
      <div class="inicioSesión-form">
        <h2>
          <img src="Assets/Svg/Icono.svg" alt="logo">
          ToDo App
        </h2>
        <form id="formLogin">
          <h3>Iniciar sesión</h3>
          <div class="form-group">
            <input type="email" placeholder="Correo" id="inputCorreo" class="form-control" required>
          </div>
          <div class="form-group">
            <input type="password" placeholder="Contraseña" id="inputPass" class="form-control" required>
          </div>
          <div class="form-group">
            <p>¿Olvidaste tu contraseña? <button id="BtnRecuperar">Click aquí</button></p>
          </div>
          <div class="form-group">
            <button type="submit" class="btn">Iniciar sesión</button>
          </div>
        </form>
        <div class="form-group">  
          <p>¿No tienes una cuenta? <button id="BtnRegistro">Regístrate</button></p>
        </div>  
      </div>
    `;

    fragment.appendChild(section);

    return fragment;
  };

  const registro = () => {
    const section = document.createElement('section');

    section.id = 'registro';
    section.innerHTML = `
      <div class="registro-form">
        <h2>
          <img src="Assets/Svg/Icono.svg" alt="logo">
          ToDo App
        </h2>
        <form id="formAgregar">
          <h3>Regístrate</h3>
          <div class="form-group">
            <input id="inputNombre" type="text" placeholder="Nombre" class="form-control" required>
          </div>
          <div class="form-group">
            <input id="inputCorreo" type="email" placeholder="Correo" class="form-control" required>
          </div>  
          <div class="form-group">
            <input id="inputPass" type="password" placeholder="Contraseña" class="form-control" required>
          </div>
          <div class="form-group">
            <button type="submit" class="btn">Regístrate</button>
          </div>
        </form>
        <div class="form-group">
          <p>¿Ya tienes una cuenta? <button id="BtnInicio">Inicia Sesión</button></p>
        </div>
      </div>
      <div class="registro-img"></div>
    `;

    fragment.appendChild(section);

    return fragment;
  };

  const toDo = () => {
    const section = document.createElement('section');

    section.id = 'toDo';
    section.innerHTML = `
          <h2>
        <img src="Assets/Svg/Icono.svg" alt="icono">
        ToDo App
      </h2>
      <div class="contenedor-tarea">
        <input type="text" id="inputTarea" placeholder="Ingrese una nueva tarea">
        <button id="btnTarea">Agregar</button>
      </div>
      <div class="contenedor-tabla">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Tarea</th>
              <th scope="col">Acción</th>
            </tr>
          </thead>
          <tbody id="tablaTareas">
          </tbody>
        </table>
      </div>
    `;

    fragment.appendChild(section);

    return fragment;
  };

  $('main').append(inicioSesión());

  // Eventos
  $(document).on('click', '#BtnInicio', () => {
    $('main').empty();
    $('main').append(inicioSesión());
  });

  $(document).on('click', '#BtnRegistro', () => {
    $('main').empty();
    $('main').append(registro());
  });

  $(document).on('click', '#BtnRecuperar', (e) => {
    e.preventDefault();

    alert('Función en desarrollo');
  });

  $(document).on('submit', '#formLogin', (e) => {
    e.preventDefault();

    const correo = $('#inputCorreo').val() as IDBValidKey;
    const pass = $('#inputPass').val() as IDBValidKey;

    if (!correo || !pass) {
      alert('Por favor, ingrese correo y contraseña');
    }

    const transaction = db.transaction('Usuarios', 'readonly');
    const store = transaction.objectStore('Usuarios');

    const request = store.openCursor();

    request.addEventListener('success', (e) => {
      const target = e.target as IDBRequest<IDBCursorWithValue>;
      const cursor = target.result;

      if (cursor) {
        const value = cursor.value;

        if (value.correo === correo && value.pass === pass) {
          alert('Inicio de sesión exitoso');

          $('main').empty();
          $('main').append(toDo());

          return;
        }
        cursor.continue();
      } else {
        alert('Correo o contraseña incorrectos');
      }
    });

    request.addEventListener('error', (e) => {
      const target = e.target as IDBRequest;

      console.error('Error al abrir la base de datos', target.error);
    });

    request.addEventListener('complete', (e) => {
      const target = e.target as IDBRequest;

      console.error('Error al abrir la base de datos', target.error);
    });
  });

  $(document).on('submit', '#formAgregar', (e) => {
    e.preventDefault();

    const usuario = {
      nombre: $('#inputNombre').val(),
      correo: $('#inputCorreo').val(),
      pass: $('#inputPass').val(),
    };

    addUsuario(usuario);

    $('main').empty();
    $('main').append(inicioSesión());
  });

  $(document).on('click', '#btnTarea', (e) => {
    e.preventDefault();

    const tarea = $('#inputTarea').val();

    if (!tarea) {
      alert('Por favor, ingrese una tarea');
      return;
    }

    $('#tablaTareas').append(`
      <tr>
        <td>${tarea}</td>
        <td>
          <button>
            <i class="bi bi-pencil"></i>
          </button>
          <button>
            <i class="bi bi-trash"></i>
          </button>
          <button>
            <i class="bi bi-check"></i>
          </button>
          <button>
            <i class="bi bi-x"></i>
          </button>
        </td>
      </tr>`);

    $('#inputTarea').val('');
  });
});
