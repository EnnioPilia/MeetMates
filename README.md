# MEET MATES
> Application web de mise en relation autour d’activités et de centres d’intérêt

---

## PRESENTATION

**Meet Mates** est une application web permettant aux utilisateurs de découvrir, organiser et participer  
à des activités variées afin de rencontrer de nouvelles personnes et partager des moments de convivialité .

Les utilisateurs peuvent :
- consulter des événements publiés par la communauté
- participer à des activités existantes
- créer leurs propres annonces afin d’inviter d’autres membres

Projet réalisé dans le cadre de la formation **Concepteur Développeur d’Applications (CDA)**.

---

## FONCTIONNALITÉS

###  Utilisateur
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

###  Administration
- Interface d’administration dédiée
- Gestion des utilisateurs
- Gestion des annonces et événements
- Protection des routes administrateur

---

## TECHNOLOGIES UTILISÉES

### Front-end
- Angular 19 (Standalone API)
- TypeScript
- Tailwind CSS
- Angular Material

### Back-end
- Spring Boot
- Java
- Spring Security
- MySQL

### Outils & DevOps
- Git / GitHub
- GitHub Actions (CI/CD)
- Docker
- Maven
- Postman

---

## ARCHITECTURE

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

## INSTALLATION

### Prérequis
- Node.js >= 22
- Angular CLI >= 19
- Java JDK 17+
- Maven
- MySQL
- Docker (optionnel)

---

## Installation du back-end

```bash
git clone https://github.com/tonpseudo/meet-mates-back.git
cd meet-mates-back
mvn clean install
```

## Variables d’environnement

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

##  Lancer le back-end

```bash
mvn spring-boot:run
```

### API accessible à l’adresse :

http://localhost:8080


###  Installation du front-end
```bash
git clone https://github.com/tonpseudo/meet-mates-front.git
cd meet-mates-front
npm install
```

###  Lancer le front-end
```bash
ng serve
```

### Application accessible à l’adresse :

http://localhost:4200

---

## DOCKER

L’application peut être exécutée via Docker afin de garantir un environnement isolé, reproductible et conforme aux standards professionnels.

### Services conteneurisés

- Backend Spring Boot  
- Base de données MySQL  
- (Optionnel) Frontend Angular  

Un fichier `docker-compose.yml` permet de lancer l’ensemble des services :

```bash
docker compose up --build
```

Cette approche permet :

- d’assurer la cohérence des environnements (développement / production)  
- de simplifier l’installation du projet  
- d’éviter les problèmes liés aux configurations locales  
- de standardiser le déploiement  
- de faciliter la mise en production  

---

## CI/CD

Un pipeline d’intégration continue et de déploiement continu est mis en place via GitHub Actions.

###  Intégration Continue (CI)

À chaque `push` ou `pull request` :

- Installation des dépendances  
- Compilation du projet  
- Exécution des tests unitaires  
- Vérification du build  

Cela permet de détecter automatiquement les erreurs avant intégration dans la branche principale et garantit la stabilité du code.

###  Déploiement Continu (CD)

Selon la branche ciblée :

- Construction de l’image Docker  
- Publication de l’image  
- Déploiement automatisé vers l’environnement cible  

Les variables sensibles (base de données, clé JWT, etc.) sont stockées de manière sécurisée dans les **GitHub Secrets** et ne sont jamais exposées dans le code source.

Cette stratégie CI/CD permet :

- d’automatiser les validations techniques  
- de sécuriser les mises en production  
- de réduire les erreurs humaines  
- d’assurer une livraison continue et fiable  

---

##  TESTS

###  Stratégie de tests
- Tests unitaires front : Angular (Jasmine / Karma)
- Tests unitaires et d’intégration back : JUnit 5, Mockito
- Tests de sécurité : Spring Security Test
- Base de données H2 pour les tests

### Lancer les tests

#### Front-end
```bash
ng test
```

#### Back-end
```bash
mvn test
```

## Sécurité

Authentification JWT
Cookies HTTP-only
Refresh token
Rôles User / Admin
Guards Angular
Configuration Spring Security
Aucune clé sensible exposée côté client

## Conclusion

Ce projet met l’accent sur :
- la **sécurité** des échanges (JWT, cookies HTTP-only, rôles)
- la **maintenabilité** du code grâce à une architecture claire et modulaire
- l’utilisation de **technologies modernes full-stack** (Angular, Spring Boot)
- une **expérience utilisateur fluide et accessible**, pensée dès la conception

Le front-end a été développé selon une approche **mobile-first**,
en combinant **Angular Material** pour garantir
une cohérence visuelle, une bonne accessibilité et des composants UI robustes,
avec **Tailwind CSS** pour la mise en page et le responsive.
L’interface est ensuite adaptée aux écrans tablette et desktop
grâce aux breakpoints Tailwind, complétés ponctuellement
par des **media queries personnalisées** lorsque nécessaire.

Meet Mates a été conçu comme une application évolutive, pouvant être enrichie
de nouvelles fonctionnalités et déployée dans un environnement professionnel

## Auteur

PILIA Ennio
Formation Concepteur Développeur d’Applications à Grenoble 
GitHub : https://github.com/EnnioPilia/MeetMates

