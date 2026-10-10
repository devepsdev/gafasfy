# 🤓 Gafas Viajeras del Mundo

Aplicación web full-stack que permite documentar y compartir las aventuras de unas gafas que viajan por el mundo. Los usuarios pueden capturar fotos con la cámara de su dispositivo, añadir su nombre, un comentario y su ubicación GPS, y ver las aventuras de otros viajeros en una galería.

🌐 **Demo en producción:** [deveps.ddns.net/gafasviajeras](https://deveps.ddns.net/gafasviajeras)

---

## 📁 Estructura del Repositorio

```Estructura
Gafasfy/
├── backend/    # API REST con Spring Boot
└── frontend/   # Interfaz de usuario con React + Vite
```

---

## 🛠️ Stack Tecnológico

### Backend Stack

- **Java 21**
- **Spring Boot 3.5.5** — Framework principal
- **Spring Data JPA + Hibernate** — Persistencia de datos
- **MapStruct 1.5.5** — Mapeo automático entre entidades y DTOs
- **Lombok** — Reducción de código boilerplate
- **MySQL 8** — Base de datos relacional
- **Maven** — Gestión de dependencias

### Frontend Stack

- **React 19** — Biblioteca principal de UI
- **Vite 7** — Build tool y servidor de desarrollo
- **Tailwind CSS 4** — Framework CSS utility-first
- **Lucide React** — Iconos
- **MediaDevices API** — Acceso a la cámara del dispositivo
- **Geolocation API** — Captura de coordenadas GPS

---

## 🚀 Características

- 📸 **Cámara en tiempo real** con cambio entre cámara frontal y trasera
- 🌍 **Geolocalización automática** al subir una foto
- 🖼️ **Galería de aventuras** con las fotos más recientes
- 🌐 **Multiidioma** — Detección automática de español/inglés
- 🎨 **Animaciones fluidas** — Partículas flotantes, gradientes dinámicos, efectos hover
- 💫 **Glassmorphism** y diseño responsive para todos los dispositivos
- ✅ **Validación de archivos** — Acepta JPEG, PNG, GIF, WebP (máximo 10 MB)

---

## ⚙️ Instalación y Configuración

### Prerrequisitos

- Java 21+
- Maven 3.8+
- Node.js 18+
- MySQL 8+

### Backend

1. Crear la base de datos en MySQL:

   ```sql
   CREATE DATABASE gafas;
   ```

2. Configurar `backend/src/main/resources/application.properties`:

   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/gafas
   spring.datasource.username=tu_usuario
   spring.datasource.password=${DB_PASSWORD}
   spring.jpa.hibernate.ddl-auto=update

   spring.servlet.multipart.max-file-size=10MB
   spring.servlet.multipart.max-request-size=10MB

   file.upload.dir=${user.home}/Imágenes/gafasviajeras
   ```

   La contraseña de MySQL no se guarda en el repositorio: se lee de la variable de entorno `DB_PASSWORD`.

3. Compilar y ejecutar:

   ```bash
   cd backend
   export DB_PASSWORD=tu_password
   mvn clean install
   mvn spring-boot:run
   ```

   El servidor arrancará en `http://localhost:8080`.

### Frontend Structure

1. Instalar dependencias:

   ```bash
   cd frontend
   npm install
   ```

2. Ejecutar en desarrollo:

   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173`.

> **Nota:** La URL de la API está configurada directamente en el código del frontend apuntando a `https://deveps.ddns.net/api/gafasviajeras`. Para apuntar a un backend local, modifica las llamadas `fetch` en `src/pages/HomePage.jsx` y `src/components/PhotoUploadForm.jsx`.

---

## 📡 API Endpoints

Base URL: `/api/photos`

| Método   | Endpoint              | Descripción                          |
| -------- | --------------------- | ------------------------------------ |
| `GET`    | `/api/photos`         | Obtener todas las fotos              |
| `GET`    | `/api/photos/{id}`    | Obtener una foto por ID              |
| `GET`    | `/api/photos/recent`  | Obtener fotos recientes (`?limit=4`) |
| `POST`   | `/api/photos/upload`  | Subir una nueva foto (multipart)     |
| `POST`   | `/api/photos`         | Crear una foto mediante JSON         |
| `PUT`    | `/api/photos/{id}`    | Actualizar una foto existente        |
| `DELETE` | `/api/photos/{id}`    | Eliminar una foto                    |

### Ejemplo — Subir una foto

```bash
curl -X POST "http://localhost:8080/api/photos/upload" \
  -F "photo=@imagen.jpg" \
  -F "name=Juan Pérez" \
  -F "comment=¡Las gafas en París!" \
  -F "lat=48.8566" \
  -F "len=2.3522"
```

### Ejemplo — Respuesta

```json
{
  "id": 1,
  "url": "a1b2c3d4_1706000000000_imagen.jpg",
  "name": "Juan Pérez",
  "comment": "¡Las gafas en París!",
  "lat": 48.8566,
  "len": 2.3522
}
```

---

## 🗄️ Modelo de Datos

### Entidad `Photo` (tabla `photos`)

| Campo       | Tipo            | Descripción                                |
| ----------- | --------------- | ------------------------------------------ |
| `id`        | `Long`          | Clave primaria, auto-generada              |
| `url`       | `String`        | Nombre del archivo guardado en disco       |
| `timestamp` | `LocalDateTime` | Fecha de subida, gestionada por la BD      |
| `name`      | `String`        | Nombre del usuario (opcional)              |
| `comment`   | `String`        | Comentario del usuario (opcional)          |
| `lat`       | `double`        | Latitud GPS                                |
| `len`       | `double`        | Longitud GPS                               |

El campo `timestamp` es `insertable = false, updatable = false`, por lo que lo gestiona directamente la base de datos.

---

## 🧪 Tests

### Backend — JUnit 5 + Mockito + H2

Los tests se ejecutan con H2 en memoria (perfil `test`) sin necesidad de MySQL.

| Clase de test | Tipo | Cobertura |
| --- | --- | --- |
| `PhotoServiceImplTest` | Unitario | `findAll`, `findById`, `save`, `deleteById`, `updatePhoto` |
| `FileStorageServiceTest` | Unitario | `saveFile`, `deleteFile`, `fileExists`, `getFilePath`, `getUploadDir` |
| `PhotoMapperTest` | Unitario | `toDTO`, `toEntity`, `toDTOList`, `toEntityList` (MapStruct) |
| `PhotoControllerTest` | Unitario (MockMvc) | Todos los endpoints REST con servicios mockeados |
| `PhotoControllerIntegrationTest` | Integración (H2) | Ciclos completos CRUD + upload sobre BD real |
| `GafasApplicationTests` | Integración | Carga del contexto de Spring |

```bash
cd backend
mvn test                   # Ejecutar todos los tests (52 tests)
mvn test -pl . -Dtest=PhotoServiceImplTest   # Ejecutar test específico
```

### Frontend — Vitest + React Testing Library

| Archivo de test | Componente/Página | Cobertura |
| --- | --- | --- |
| `FloatingParticles.test.jsx` | `FloatingParticles` | Renderizado, partículas, clases CSS |
| `PhotoCard.test.jsx` | `PhotoCard` | Datos completos, valores nulos, coordenadas |
| `PhotoUploadForm.test.jsx` | `PhotoUploadForm` | Pasos del formulario, navegación, envío |
| `HomePage.test.jsx` | `HomePage` | API fetch, estado de carga, navegación |
| `UploadPage.test.jsx` | `UploadPage` | Renderizado, navegación |
| `App.test.jsx` | `App` + `useLanguage` | Hook de idioma, navegación entre páginas |

```bash
cd frontend
npm test           # Modo watch interactivo
npm run test:run   # Ejecución única (47 tests)
npm run coverage   # Cobertura de código
```

---

## 📦 Scripts disponibles

### Backend Scripts

```bash
mvn clean package          # Compilar y empaquetar
mvn test                   # Ejecutar tests (52 tests, H2 en memoria)
java -jar target/*.jar     # Ejecutar el JAR generado
```

### Frontend

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build para producción (genera /dist)
npm run preview    # Preview del build de producción
npm run lint       # Linting con ESLint
npm run test:run   # Ejecutar tests (47 tests)
npm run coverage   # Informe de cobertura
```

---

## 📁 Estructura detallada

### Backend estructura

```Estructura
backend/src/main/java/net/ddns/deveps/gafas/
├── GafasApplication.java
├── config/
│   └── WebConfig.java              # CORS y recursos estáticos
├── controllers/
│   └── PhotoController.java        # Endpoints REST
├── dto/
│   └── PhotoDTO.java
├── entities/
│   └── Photo.java
├── mappers/
│   └── PhotoMapper.java            # MapStruct
├── repositories/
│   └── PhotoRepository.java
└── services/
    ├── FileStorageService.java     # Manejo de archivos en disco
    ├── PhotoService.java
    └── impl/
        └── PhotoServiceImpl.java
```

### Frontend estructura

```Estructura
frontend/src/
├── components/
│   ├── CameraPreview.jsx           # Captura desde cámara
│   ├── FloatingParticles.jsx       # Fondo animado decorativo
│   ├── PhotoCard.jsx               # Tarjeta individual de foto
│   └── PhotoUploadForm.jsx         # Formulario de subida
├── pages/
│   ├── HomePage.jsx                # Galería de aventuras
│   └── UploadPage.jsx              # Página de subida
├── App.jsx                         # Enrutamiento y traducciones
├── main.jsx                        # Punto de entrada
└── index.css                       # Estilos base y animaciones
```

---

## 👨‍💻 Autor

**DevEps** - Desarrollador Full Stack

- GitHub: [github.com/devepsdev](https://github.com/devepsdev)
- Portfolio: [deveps.ddns.net](https://deveps.ddns.net)
- Email: devepsdev@gmail.com
- LinkedIn: [www.linkedin.com/in/enrique-perez-sanchez](https://www.linkedin.com/in/enrique-perez-sanchez/)

---

⭐ ¡Dale una estrella si el proyecto te ha resultado útil!
