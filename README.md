# 🎯 Reto DAW - Sistema de Gestión de Vacantes de Empleo (SGVE)

Este proyecto forma parte del reto individual de Segundo DAW. Consiste en el desarrollo de una aplicación web completa para la gestión de vacantes de empleo y solicitudes de usuarios. El sistema está dividido en dos aplicaciones independientes: una para el frontend y otra para el backend.

## 🧩 Estructura del Proyecto


---

## 🔍 Objetivos del Sistema

- Permitir a empresas registrar y gestionar vacantes de empleo.
- Facilitar a los usuarios la búsqueda y postulación a vacantes.
- Proporcionar una plataforma centralizada para administración, gestión y filtrado de solicitudes.
- Ofrecer una experiencia intuitiva tanto para usuarios como para empresas.

---

## 🧪 Funcionalidades Principales

### 👔 Empresa
- Crear, editar, cancelar y asignar vacantes.
- Ver y gestionar solicitudes de usuarios.
- Editar datos propios de la empresa.

### 🛠️ Administrador
- Alta, edición y gestión de empresas.
- CRUD de categorías.
- Gestión de usuarios (activar/desactivar).
- CRUD de otros administradores.

### 👤 Usuario
- Registro y autenticación.
- Búsqueda de vacantes filtradas.
- Envío de solicitudes con currículum y detalles.
- Seguimiento y cancelación de solicitudes.

---

## 🧰 Tecnologías Utilizadas

| Capa         | Tecnologías |
|--------------|-------------|
| Frontend     | Angular 17, TypeScript, HTML5, CSS3, Bootstrap |
| Backend      | Spring Boot, Java 17, JPA, Maven |
| Base de datos| MySQL 8 |
| Seguridad    | JWT / Spring Security (según implementación) |
| Herramientas | Visual Studio Code, Postman, Git, GitHub, Figma |
| Despliegue   | Tomcat embebido, WAR, FTP |

---

## 🔐 Autenticación

- **Básica:** Login por email y password.
- **Avanzada:** Con Spring Security y JSON Web Tokens (JWT).
- Los roles definen los permisos: `USUARIO`, `EMPRESA`, `ADMON`.

---

## 🧠 Arquitectura

- **Frontend:** Angular, ejecutado en local (`ng serve`), se comunica con el backend vía HTTP.
- **Backend:** Spring Boot con API RESTful y acceso a MySQL.
- **Base de datos:** MySQL, diseñada con relaciones para usuarios, empresas, vacantes y solicitudes.

---

## 🚀 Despliegue

1. **Frontend**
   ```bash
   cd SGVE-Angular
   npm install
   ng serve
