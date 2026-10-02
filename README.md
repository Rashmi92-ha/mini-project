# 📊 Employee Management System (Angular Frontend)

A responsive employee management dashboard built with Angular, with secure JWT-based authentication and a REST API backend.

🌐 **Live Demo:** [mini-project-iota-rosy.vercel.app](https://mini-project-iota-rosy.vercel.app)
⚙️ **Backend Repository:** [mini-project-backend](https://github.com/Rashmi92-ha/mini-project-backend)

> ⏳ The backend runs on a free hosting tier, so the first request after inactivity may take 30–60 seconds. Please wait for the first load to complete.
> 🔑 **Demo login:** `demo@example.com` / `Demo@123`

## 📸 Screenshots

<p align="left">
  <img width="600" alt="Employee dashboard" src="https://github.com/user-attachments/assets/5f327e7e-da86-465d-b76c-d1cc6da64cde" />
  &nbsp;&nbsp;
  <img width="200" alt="Login page" src="https://github.com/user-attachments/assets/d48a6f02-95ec-4253-ad65-771bfc019301" />
</p>


## ✨ Features

- **JWT authentication:** secure login with the token attached to outgoing requests
- **HTTP Interceptor:** automatically adds the JWT to API calls
- **Route Guards:** protects pages from unauthenticated access
- **Dynamic data tables:** employee records loaded from the REST API
- **Responsive dashboard** layout
- **Reactive search:** RxJS-powered search using `debounceTime` and `distinctUntilChanged`, applied to the loaded employee list
- **Filtering:** client-side filtering by [department / role / status]
- **Pagination:** client-side pagination of the loaded data

## 🛠️ Tech Stack

- **Frontend:** Angular 20, TypeScript, RxJS, HTML5, CSS3
- **Backend:** Node.js, Express, MongoDB (see the [backend repo](https://github.com/Rashmi92-ha/mini-project-backend))
- **Deployment:** Vercel (frontend), Render (backend)

## 🏗️ Architecture

​```mermaid
graph LR
    U[User] --> F[Angular Frontend]
    F -- REST API / JWT --> S[Node + Express Backend]
    S --> DB[(MongoDB)]
​```

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS) and npm
- Angular CLI: `npm install -g @angular/cli`

### Run locally
​```bash

git clone https://github.com/Rashmi92-ha/mini-project.git

cd mini-project

npm install

ng serve
​```
Open `http://localhost:4200/`.

### Connect to the backend
Update the API base URL in `[src/environments/environment.ts]` to either the live API or your local backend (`(http://localhost:5000)`).

## 📁 Project Structure

​```
src/app/
├── [components/]   # UI components

├── [services/]     # API and auth services

├── [guards/]       # Route guards

└── [interceptors/] # JWT HTTP interceptor
​```

## 📚 What I Learned

- Implementing token-based authentication end to end
- Using interceptors and guards to keep auth logic out of components
- Add proper error handling and user-friendly error messages for API failures, validation errors, and network issues.

---
Built with Angular 20 · [Rashmi K S](https://www.linkedin.com/in/rashmiks-dev/)
