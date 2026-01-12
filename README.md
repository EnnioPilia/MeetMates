# MEET MATES
> Application web de mise en relation autour d’activités et de centres d’intérêt

---

## 📌 Présentation

**Meet Mates** est une application web permettant aux utilisateurs de découvrir, organiser et participer  
à des activités variées afin de rencontrer de nouvelles personnes et partager des moments de convivialité.

Les utilisateurs peuvent :
- consulter des événements publiés par la communauté
- participer à des activités existantes
- créer leurs propres annonces afin d’inviter d’autres membres

Projet réalisé dans le cadre de la formation **Concepteur Développeur d’Applications (CDA)**.

---

## 🚀 Fonctionnalités

### 👤 Utilisateur
- Création de compte
- Authentification sécurisée (JWT + cookies HTTP-only)
- Gestion du profil utilisateur
- Suppression du compte (soft delete / hard delete)
- Consultation des événements
- Recherche et filtrage des activités
- Participation aux événements
- Création, modification et suppression d’annonces
- Page **Mes activités**
  - événements organisés
  - événements auxquels l’utilisateur participe

### 🛠️ Administration
- Interface d’administration dédiée
- Gestion des utilisateurs
- Gestion des annonces et événements
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
- MySQL

### Outils & DevOps
- Git / GitHub
- Docker
- Maven
- Postman

---

## 🏗️ Architecture

- **Frontend** : SPA Angular (Standalone Components)
- **Backend** : API REST Spring Boot
- **Base de données** : MySQL
- **Authentification**
  - JWT stocké en cookies HTTP-only
  - Refresh token
  - Sécurisation via Spring Security

### Back-end
- Controllers
- Services
- Repositories
- DTO / Mappers

### Front-end
- Services
- Guards
- Interceptors
- Components & Features modulaires

---

## ⚙️ Installation

### Prérequis
- Node.js >= 22
- Angular CLI >= 19
- Java JDK 17+
- Maven
- MySQL
- Docker (optionnel)

---

## 🔧 Installation du back-end

```bash
git clone https://github.com/tonpseudo/meet-mates-back.git
cd meet-mates-back
mvn clean install
```

🔐 Variables d’environnement

Les données sensibles ne sont pas stockées en dur.

Les fichiers application.properties utilisent uniquement
des variables d’environnement système.

```env
DB_URL=jdbc:mysql://localhost:3306/meetmates
DB_USER=your_db_user
DB_PASS=your_db_password
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:4200
```

## ▶️ Lancer le back-end

```bash
mvn spring-boot:run
```

API accessible à l’adresse :

http://localhost:8080


🎨 Installation du front-end
```bash
git clone https://github.com/tonpseudo/meet-mates-front.git
cd meet-mates-front
npm install
```

▶️ Lancer le front-end
```bash
ng serve
```

Application accessible à l’adresse :
http://localhost:4200

🧪 Tests
Front-end
```bash
ng test
```
Back-end
```bash
mvn test
```
Technologies de test

JUnit
Mockito
Spring Security Test
Base de données H2

🔐 Sécurité

Authentification JWT
Cookies HTTP-only
Refresh token
Rôles User / Admin
Guards Angular
Configuration Spring Security
Aucune clé sensible exposée côté client

👤 Auteur

Ton Nom
Formation Concepteur Développeur d’Applications (CDA)
GitHub : https://github.com/tonpseudo
