# 🍴 Mi Gusto – Carta Digital

Feed scrolleable de promociones con panel de administración completo, construido con React + Firebase.

---

## ✨ Características

- **Feed público**: Scroll vertical infinito de promociones con imágenes, lazy loading y animaciones
- **Panel admin**: CRUD completo con upload de imágenes drag & drop
- **Autenticación**: Firebase Auth con sesión persistente
- **Diseño responsive**: Mobile-first, perfecto en desktop
- **Filtros y orden**: Por estado (activa/inactiva) y fecha
- **Toast notifications**: Feedback de acciones en tiempo real

---

## 🛠️ Stack

| Tecnología | Uso |
|---|---|
| React 18 + Vite | Frontend |
| TailwindCSS | Estilos |
| React Router v6 | Navegación |
| Firebase Auth | Autenticación |
| Firestore | Base de datos |
| Firebase Storage | Almacenamiento de imágenes |
| React Hook Form + Zod | Formularios y validación |
| Lucide React | Iconos |

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <repo-url>
cd mi-gusto
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Firebase

#### a) Crear proyecto en Firebase

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Crear un nuevo proyecto
3. Agregar una app web

#### b) Habilitar servicios

En la consola de Firebase:

- **Authentication** → Sign-in method → Email/Password → Habilitar
- **Firestore Database** → Crear base de datos (modo producción o test)
- **Storage** → Comenzar

#### c) Crear usuario admin

En **Authentication** → Users → Add user:
- Email: `admin@migusto.com` (o el que prefieras)
- Password: tu contraseña segura

#### d) Reglas de Firestore

En **Firestore** → Rules, pegar:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Cualquiera puede leer promociones activas
    match /promotions/{promotionId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### e) Reglas de Storage

En **Storage** → Rules, pegar:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /promotions/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Variables de entorno

```bash
cp .env.example .env
```

Completar `.env` con los valores de **Firebase Console → Configuración del proyecto → SDK de configuración**:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 5. Iniciar en desarrollo

```bash
npm run dev
```

Abrir [http://localhost:5173](http://localhost:5173)

---

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── feed/
│   │   ├── PromotionCard.jsx    # Card individual del feed
│   │   ├── FeedList.jsx         # Lista con infinite scroll
│   │   └── FeedLoader.jsx       # Skeleton de carga
│   ├── admin/
│   │   ├── AdminPanel.jsx       # Panel principal
│   │   ├── PromotionForm.jsx    # Formulario crear/editar
│   │   ├── ImageUploader.jsx    # Upload con drag & drop
│   │   └── PromotionList.jsx    # Lista con CRUD
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Layout.jsx
│   └── common/
│       ├── Button.jsx
│       ├── Modal.jsx
│       ├── Alert.jsx
│       └── ToastContainer.jsx
├── pages/
│   ├── Home.jsx        # Feed público
│   ├── Admin.jsx       # Panel (protegido)
│   └── Login.jsx       # Login
├── services/
│   ├── firebase.js         # Inicialización Firebase
│   ├── promotionsService.js # CRUD + Storage
│   └── authService.js      # Autenticación
├── hooks/
│   ├── usePromotions.js    # Feed + Admin hooks
│   ├── useAuth.js          # Auth state
│   └── useToast.js         # Toast notifications
├── utils/
│   ├── validators.js       # Esquemas Zod
│   └── helpers.js          # Funciones utilitarias
├── types.ts                # Interfaces TypeScript
└── index.css               # Estilos globales + Tailwind
```

---

## 📋 Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |

---

## 🎨 Paleta de colores

| Color | Valor | Uso |
|---|---|---|
| Primario | `#FF6B35` | Botones, acentos |
| Secundario | `#2EC4B6` | Badges "Vigente", éxito |
| Fondo | `#FFFFFF` | Fondo principal |
| Fondo secundario | `#F7F7F7` | Fondo de página |
| Texto | `#1A1A1A` | Texto principal |
| Texto secundario | `#666666` | Texto auxiliar |
| Error | `#E63946` | Errores |

---

## 🗺️ Rutas

| Ruta | Descripción | Acceso |
|---|---|---|
| `/` | Feed de promociones | Público |
| `/login` | Inicio de sesión | Público |
| `/admin` | Panel de administración | Solo usuarios autenticados |

---

## 🔒 Seguridad

- Las rutas de admin están protegidas: redirigen a `/login` si no hay sesión
- Las reglas de Firestore y Storage permiten lectura pública pero escritura solo autenticada
- Las imágenes se validan por tipo y tamaño antes de subirse
- Los formularios tienen validación tanto client-side (Zod) como protección Firebase

---

## 📦 Deploy

### Firebase Hosting

```bash
npm run build
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Vercel

```bash
npm run build
npx vercel --prod
```

Recordar agregar las variables de entorno en el dashboard del proveedor.

---

## 📸 Formatos de imagen soportados

- JPEG / JPG
- PNG  
- WebP
- Tamaño máximo: **5MB**
- Se recomienda relación de aspecto **16:9** o **4:3**
