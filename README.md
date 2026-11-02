# EduSphere MERN — student study workspace

This is a teaching-oriented MERN conversion of the supplied EduSphere HTML project. It keeps the calm cream/green visual direction and the dashboard, registration/login, to-do/assignment list, and focus timer. The application now stores users, tasks, assignments and completed focus sessions in MongoDB instead of using localStorage as the database. Local storage is used only to keep the JWT and a small user display object between page refreshes.

## Requirements
- Node.js 20 or newer
- MongoDB Community Server running locally
- A terminal for the backend and another terminal for the frontend

## Run it

1. Start the local MongoDB service.
2. In a terminal:
   ```bash
   cd server
   npm install
   ```
3. Copy `.env.example` to `.env`. Keep `MONGO_URI=mongodb://localhost:27017/EduSphere`. Change `JWT_SECRET` to a long random value for your own machine.
4. Start backend:
   ```bash
   npm run dev
   ```
   The API runs at `http://localhost:5000`. Test `http://localhost:5000/api/health`.
5. Open a second terminal:
   ```bash
   cd client
   npm install
   ```
6. Copy `client/.env.example` to `client/.env` if you want to set the API URL explicitly. Start the frontend:
   ```bash
   npm run dev
   ```
7. Open the Vite URL, usually `http://localhost:5173`, and register a new account.

## Folder map

```text
EduSphere_MERN/
  client/                     React + Vite application
    src/api.js                fetch helper and bearer token
    src/context/AuthContext.jsx authentication state
    src/components/            shared layout and protected route
    src/pages/                 login/register, dashboard, to-do, timer
    src/styles.css             Tailwind directives and responsive design
  server/                     Express API
    config/db.js               MongoDB connection
    models/                    Mongoose schemas
    controllers/                route logic
    middleware/auth.js          JWT verification
    routes/                     API endpoints and Multer upload
    uploads/                    uploaded assignment files
    server.js                   app setup and listening port
```

## Main API routes

| Method | Route | Purpose | Authentication |
|---|---|---|---|
| GET | `/api/health` | API status | No |
| POST | `/api/auth/register` | Create account and return token | No |
| POST | `/api/auth/login` | Verify password and return token | No |
| GET | `/api/auth/me` | Return signed-in user | Yes |
| GET | `/api/tasks` | List the signed-in user's tasks | Yes |
| POST | `/api/tasks` | Create task or assignment; optional file field `file` | Yes |
| PATCH | `/api/tasks/:id` | Update task fields / completion | Yes |
| DELETE | `/api/tasks/:id` | Delete a task | Yes |
| GET | `/api/sessions` | List recent focus sessions | Yes |
| POST | `/api/sessions` | Save a completed focus session | Yes |

Every task query includes the authenticated user's ID. This is important: the frontend hiding a page is not enough to protect data; the backend also checks the JWT and scopes database operations to the signed-in user.

## MongoDB shell practice

Run these in `mongosh` after starting MongoDB:

```javascript
show dbs
use EduSphere
show collections
db.users.find({}, { firstName: 1, email: 1 })
db.tasks.find().pretty()
db.studysessions.find().pretty()
```

Mongoose usually creates collection names by lowercasing and pluralizing model names: `User` → `users`, `Task` → `tasks`, and `StudySession` → `studysessions`.

## Viva notes: explain the important concepts

### Node.js, `http`, `fs`, `path`, and modules
- Node.js runs JavaScript outside a browser. The original classroom exercise can create a server with Node's built-in `http` module and respond with `createServer()` and `listen()`.
- `fs` reads/writes files; `path` safely joins file-system paths. This project uses `path` to configure the uploads folder. Multer writes the uploaded file; `fs` is not needed for every API request.
- A user-built module is a file exporting a function/value and another file importing it. `config/db.js`, controllers, models and routes are examples. `import`/`export` are enabled by `"type": "module"` in package.json.
- `package.json` records dependencies and scripts. `npm run dev` runs `nodemon server.js`; nodemon restarts Node after backend source changes.
- Express is a framework built on Node's HTTP capabilities. Middleware runs in order; here CORS, JSON parsing, static uploads, routes and error handling are registered in `server.js`.

### Request and response flow
1. React event handler calls `api()` in `client/src/api.js`.
2. `fetch()` sends an HTTP request to Express. JSON requests include `Content-Type`; protected requests include `Authorization: Bearer <token>`.
3. Express middleware parses the request. `protect` verifies the JWT and attaches the user ID to `req`.
4. A route calls a controller. The controller validates data and calls a Mongoose model.
5. Mongoose sends database operations to MongoDB. Express returns JSON; React updates state and re-renders the UI.

### JWT: header, payload, signature
- Header: identifies the token type and signing algorithm.
- Payload: this project stores the user's database ID as `userId`; do not put passwords or secrets here. JWT payloads are encoded, not encrypted.
- Signature: produced from the header, payload and server secret. `jwt.verify()` detects a changed or invalid signature and checks expiry.
- Authentication answers “who are you?” Authorization answers “what may you access?” `protect` authenticates the request, and task queries restrict data to `req.userId` for authorization.

### bcryptjs
Registration hashes the password using `bcrypt.hash(password, 10)`. The database stores the hash, not the original password. Login uses `bcrypt.compare()` to compare the typed password against the hash.

### MongoDB and Mongoose
MongoDB stores BSON documents in collections. Mongoose schemas define expected fields and validation; a model gives methods such as `find`, `findOne`, `create`, `findOneAndUpdate` and `findOneAndDelete`. A schema is the structure; a model is the interface used to query the collection.

### Multer
Multer is Express middleware for `multipart/form-data`. `upload.single('file')` accepts one file under the field named `file`. It saves it under `server/uploads`, limits file size to 5 MB, and makes metadata available in `req.file`. For a real deployment, add file-type validation, private file access, malware scanning and cloud storage as appropriate.

### `fetch`, synchronous vs asynchronous
`fetch()` returns a Promise. `async` functions allow `await` so code can read naturally while waiting for network/database work. These operations are asynchronous because waiting for I/O should not block the event loop. `setInterval()` in the focus timer ticks the clock; cleanup with `clearInterval()` prevents duplicate intervals when the component changes or unmounts.

### Stateful vs stateless
- HTTP is stateless by default: each request must carry enough information to be understood.
- JWT authentication is used here as a stateless token approach: the server verifies the signed token on each protected request instead of maintaining a server-side login session. The user/task data itself remains stateful in MongoDB.
- React `useState` is client-side UI state. localStorage keeps the token across reloads, but it is not the main data store. Do not store passwords in localStorage.

### React and charts
- Components split the UI into reusable pieces. Props pass values down; `useState` holds changing UI data; `useEffect` loads data and manages intervals; React Router maps URL paths to pages.
- `api()` centralizes fetch, bearer-token and error handling.
- Recharts displays focus minutes and task completion using data returned by the API.
- CSS provides page transitions, staggered card entrance, skeletons, modal motion, hover lifts and responsive layouts. The reduced-motion media query reduces animation for users who request it.

## Scope notes
- The supplied original contained dashboard, login/register, to-do and timer pages. The React version recreates these main screens and connects tasks, assignments, accounts and focus sessions to the backend. It does not claim to implement a real Google login, password-reset email, or external integrations.
- The assignment upload is served from the local Express server for this classroom project. Use authenticated download routes before deploying sensitive files publicly.
- For an easy viva walkthrough, explain one path end-to-end: register form → `authenticate()` → `fetch()` → Express route → bcrypt + Mongoose → JWT response → localStorage token → protected API request → JWT middleware → user-scoped database query.
