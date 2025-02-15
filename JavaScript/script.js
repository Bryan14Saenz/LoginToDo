'use strict';
$(function () {
    // Constantes
    var fragment = document.createDocumentFragment();
    var IDBRequest = indexedDB.open('Usuarios', 1);
    var IDBRequest2 = indexedDB.open('Tareas', 1);
    var db;
    // Funciones
    IDBRequest.addEventListener('upgradeneeded', function (e) {
        var target = e.target;
        if (target) {
            var db_1 = target.result;
            if (!db_1.objectStoreNames.contains('Usuarios')) {
                db_1.createObjectStore('Usuarios', { autoIncrement: true });
            }
        }
    });
    IDBRequest.addEventListener('success', function (e) {
        var target = e.target;
        if (target) {
            db = target.result;
        }
    });
    IDBRequest.addEventListener('error', function (e) {
        var target = e.target;
        console.error('Error al abrir la base de datos', target.error);
    });
    var addUsuario = function (usuario) {
        if (usuario === void 0) { usuario = {}; }
        if (!db) {
            console.error('No se ha abierto la base de datos');
            return;
        }
        var transaction = db.transaction('Usuarios', 'readwrite');
        var store = transaction.objectStore('Usuarios');
        var request = store.add(usuario);
        request.addEventListener('success', function (e) {
            alert('Usuario agregado');
        });
        request.addEventListener('error', function (e) {
            var target = e.target;
            console.error('Error al agregar el cliente', target.error);
        });
    };
    var inicioSesión = function () {
        var section = document.createElement('section');
        section.id = 'inicioSesión';
        section.innerHTML = "\n      <div class=\"inicioSesi\u00F3n-img\"></div>\n      <div class=\"inicioSesi\u00F3n-form\">\n        <h2>\n          <img src=\"Assets/Svg/Icono.svg\" alt=\"logo\">\n          ToDo App\n        </h2>\n        <form id=\"formLogin\">\n          <h3>Iniciar sesio\u0301n</h3>\n          <div class=\"form-group\">\n            <input type=\"email\" placeholder=\"Correo\" id=\"inputCorreo\" class=\"form-control\" required>\n          </div>\n          <div class=\"form-group\">\n            <input type=\"password\" placeholder=\"Contrasen\u0303a\" id=\"inputPass\" class=\"form-control\" required>\n          </div>\n          <div class=\"form-group\">\n            <p>\u00BFOlvidaste tu contrasen\u0303a? <button id=\"BtnRecuperar\">Click aqu\u00ED</button></p>\n          </div>\n          <div class=\"form-group\">\n            <button type=\"submit\" class=\"btn\">Iniciar sesio\u0301n</button>\n          </div>\n        </form>\n        <div class=\"form-group\">  \n          <p>\u00BFNo tienes una cuenta? <button id=\"BtnRegistro\">Regi\u0301strate</button></p>\n        </div>  \n      </div>\n    ";
        fragment.appendChild(section);
        return fragment;
    };
    var registro = function () {
        var section = document.createElement('section');
        section.id = 'registro';
        section.innerHTML = "\n      <div class=\"registro-form\">\n        <h2>\n          <img src=\"Assets/Svg/Icono.svg\" alt=\"logo\">\n          ToDo App\n        </h2>\n        <form id=\"formAgregar\">\n          <h3>Regi\u0301strate</h3>\n          <div class=\"form-group\">\n            <input id=\"inputNombre\" type=\"text\" placeholder=\"Nombre\" class=\"form-control\" required>\n          </div>\n          <div class=\"form-group\">\n            <input id=\"inputCorreo\" type=\"email\" placeholder=\"Correo\" class=\"form-control\" required>\n          </div>  \n          <div class=\"form-group\">\n            <input id=\"inputPass\" type=\"password\" placeholder=\"Contrasen\u0303a\" class=\"form-control\" required>\n          </div>\n          <div class=\"form-group\">\n            <button type=\"submit\" class=\"btn\">Regi\u0301strate</button>\n          </div>\n        </form>\n        <div class=\"form-group\">\n          <p>\u00BFYa tienes una cuenta? <button id=\"BtnInicio\">Inicia Sesio\u0301n</button></p>\n        </div>\n      </div>\n      <div class=\"registro-img\"></div>\n    ";
        fragment.appendChild(section);
        return fragment;
    };
    var toDo = function () {
        var section = document.createElement('section');
        section.id = 'toDo';
        section.innerHTML = "\n          <h2>\n        <img src=\"Assets/Svg/Icono.svg\" alt=\"icono\">\n        ToDo App\n      </h2>\n      <div class=\"contenedor-tarea\">\n        <input type=\"text\" id=\"inputTarea\" placeholder=\"Ingrese una nueva tarea\">\n        <button id=\"btnTarea\">Agregar</button>\n      </div>\n      <div class=\"contenedor-tabla\">\n        <table class=\"table\">\n          <thead>\n            <tr>\n              <th scope=\"col\">Tarea</th>\n              <th scope=\"col\">Accio\u0301n</th>\n            </tr>\n          </thead>\n          <tbody id=\"tablaTareas\">\n          </tbody>\n        </table>\n      </div>\n    ";
        fragment.appendChild(section);
        return fragment;
    };
    $('main').append(inicioSesión());
    // Eventos
    $(document).on('click', '#BtnInicio', function () {
        $('main').empty();
        $('main').append(inicioSesión());
    });
    $(document).on('click', '#BtnRegistro', function () {
        $('main').empty();
        $('main').append(registro());
    });
    $(document).on('click', '#BtnRecuperar', function (e) {
        e.preventDefault();
        alert('Función en desarrollo');
    });
    $(document).on('submit', '#formLogin', function (e) {
        e.preventDefault();
        var correo = $('#inputCorreo').val();
        var pass = $('#inputPass').val();
        if (!correo || !pass) {
            alert('Por favor, ingrese correo y contraseña');
        }
        var transaction = db.transaction('Usuarios', 'readonly');
        var store = transaction.objectStore('Usuarios');
        var request = store.openCursor();
        request.addEventListener('success', function (e) {
            var target = e.target;
            var cursor = target.result;
            if (cursor) {
                var value = cursor.value;
                if (value.correo === correo && value.pass === pass) {
                    alert('Inicio de sesión exitoso');
                    $('main').empty();
                    $('main').append(toDo());
                    return;
                }
                cursor.continue();
            }
            else {
                alert('Correo o contraseña incorrectos');
            }
        });
        request.addEventListener('error', function (e) {
            var target = e.target;
            console.error('Error al abrir la base de datos', target.error);
        });
        request.addEventListener('complete', function (e) {
            var target = e.target;
            console.error('Error al abrir la base de datos', target.error);
        });
    });
    $(document).on('submit', '#formAgregar', function (e) {
        e.preventDefault();
        var usuario = {
            nombre: $('#inputNombre').val(),
            correo: $('#inputCorreo').val(),
            pass: $('#inputPass').val(),
        };
        addUsuario(usuario);
        $('main').empty();
        $('main').append(inicioSesión());
    });
    $(document).on('click', '#btnTarea', function (e) {
        e.preventDefault();
        var tarea = $('#inputTarea').val();
        if (!tarea) {
            alert('Por favor, ingrese una tarea');
            return;
        }
        $('#tablaTareas').append("\n      <tr>\n        <td>".concat(tarea, "</td>\n        <td>\n          <button>\n            <i class=\"bi bi-pencil\"></i>\n          </button>\n          <button>\n            <i class=\"bi bi-trash\"></i>\n          </button>\n          <button>\n            <i class=\"bi bi-check\"></i>\n          </button>\n          <button>\n            <i class=\"bi bi-x\"></i>\n          </button>\n        </td>\n      </tr>"));
        $('#inputTarea').val('');
    });
});
