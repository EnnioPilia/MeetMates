# MEET MATES
> Application web de mise en relation autour d’activités et de centres d’intérêt

---

## 📌 Présentation

Meet Mates est une application web permettant aux utilisateurs de découvrir, organiser et participer
à des activités variées afin de rencontrer de nouvelles personnes et partager des moments de convivialité.

Les utilisateurs peuvent consulter des événements publiés par la communauté, participer à des activités existantes
ou créer leurs propres annonces afin d’inviter d’autres membres à les rejoindre.

Ce projet a été réalisé dans le cadre de la formation **Concepteur Développeur d’Applications (CDA)**.

---

## 🚀 Fonctionnalités

### 👤 Utilisateur
- Création de compte utilisateur
- Authentification sécurisée via JWT (cookies HTTP-only + refresh token)
- Modification du profil utilisateur
- Suppression du compte (soft delete et hard delete)
- Consultation des événements
- Recherche et filtrage des activités
- Participation à des événements
- Création, modification et suppression d’annonces (soft delete et hard delete)
- Accès à une page **Mes activités** :
  - événements organisés
  - événements auxquels l’utilisateur participe

### 🛠️ Administration
- Accès à une interface d’administration dédiée
- Gestion des utilisateurs (soft delete et hard delete)
- Gestion des annonces / événements (soft delete et hard delete)
- Protection des routes administrateur

---

## 🛠️ Technologies utilisées

### Front-end
- Angular 19 (Standalone API)
- TypeScript
- Tailwind CSS

### Back-end
- Spring Boot
- Java
- Spring Security
- MySQL (Workbench)

### Outils & DevOps
- Git / GitHub
- Docker
- Maven
- Postman

---

## 🏗️ Architecture

- **Frontend** : SPA Angular avec architecture moderne (Standalone Components)
- **Backend** : API REST Spring Boot
- **Base de données** : MySQL
- **Authentification** :
  - JWT stocké en cookies HTTP-only
  - Refresh token
  - Sécurisation via Spring Security
- **Architecture back-end** :
  - Controllers
  - Services
  - Repositories
  - DTO / Mappers
- **Architecture front-end** :
  - Facades
  - Services
  - Guards
  - Interceptors
  - Components et Features modulaires

---

## ⚙️ Installation

### Prérequis
- Node.js >= 22
- Angular CLI >= 19
- Java JDK 17 ou supérieur
- Maven
- MySQL
- Docker (optionnel)

---

### 🔧 Installation du back-end

```bash
git clone https://github.com/tonpseudo/meet-mates-back.git
cd meet-mates-back
mvn clean install
---
## 🔐 Variables d’environnement

Les données sensibles ne sont **pas stockées en dur** dans les fichiers de configuration.

Les fichiers `application.properties` et `application-*.properties` référencent uniquement
des variables d’environnement système.

### Variables requises

```env
DB_URL=jdbc:mysql://localhost:3306/meetmates
DB_USER=your_db_user
DB_PASS=your_db_password
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:4200

MAIL_HOST=...
MAIL_USER=...
MAIL_PASS=...
---
## ▶️ Lancer le back-end

```bash
mvn spring-boot:run
```

L’API est accessible par défaut à l’adresse :

```
http://localhost:8080
```

---

## 🎨 Installation du front-end

```bash
git clone https://github.com/tonpseudo/meet-mates-front.git
cd meet-mates-front
npm install
```

---

## ▶️ Lancer le front-end

```bash
ng serve
```

L’application est accessible à l’adresse :

```
http://localhost:4200
```

---

## 🧪 Tests

### Front-end

```bash
ng test
```

### Back-end

```bash
mvn test
```

### Technologies de test

- JUnit
- Mockito
- Spring Security Test
- Base de données H2 (tests)

---

## 🔐 Sécurité

- Authentification JWT
- Cookies HTTP-only
- Refresh token
- Protection des routes par rôles (**User / Admin**)
- Guards Angular côté front
- Filtres et configuration Spring Security côté back
- Aucune clé sensible exposée côté client

---

## 👤 Auteur

- **Ton Nom**
- Formation Concepteur Développeur d’Applications (CDA)
- GitHub : https://github.com/tonpseudo
