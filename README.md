# MEET MATES 
 > Projet réalisé dans le cadre de l’obtention du titre de Concepteur Développeur d’Applications (Bac +4) à Simplon Grenoble en 2026.
---

## PRESENTATION

**Meet Mates** est une application web permettant aux utilisateurs de découvrir, organiser et participer  
à des activités variées afin de rencontrer de nouvelles personnes et partager des moments de convivialité .

Les utilisateurs peuvent :
- Consulter des événements publiés par la communauté
- Participer à des activités existantes
- Créer et gérer ses propres annonces afin d’inviter d’autres membres
  
---

## FONCTIONNALITÉS

###  Utilisateur
- Inscription & authentification sécurisée (JWT + cookies HTTP-only)
- Gestion du profil utilisateur
- Suppression du compte (soft delete / hard delete)
- Création et participation aux événements
- Modification et suppression d’annonces
- Recherche et filtrage des activités

###  Administration
- Interface d’administration dédiée
- Gestion des utilisateurs  (désactivation ou bannissement de comptes)
- Modéreration des événements (suppression / désactivation)

---

## STACK & OUTILS 

### Front-end
- Angular (RxJS, Signals)
- TypeScript
- Tailwind CSS
- Angular Material

### Back-end
- Spring Boot
- Java
- Persistance des données via JPA / Hibernate (ORM)
- Spring Security
- Apache Maven

### Bases de données
- MySQL
- Flyway

### Outils & DevOps
- Git / GitHub
- GitHub Actions (CI/CD)
- Docker
- Postman
- Figma

---

## ARCHITECTURE

### Front-end
**SPA Angular** avec Standalone Components

Architecture modulaire en couches (core, features, shared) :
- Services & Facades : abstraction de la logique métier
- Guards : contrôle d’accès côté UX
- Interceptors : gestion centralisée des requêtes HTTP et des credentials
- Components features & shared : pour l’affichage UI

### Back-end
**API REST stateless Spring Boot** 

Architecture modulaire par domaine métier (auth, user, event...) :
- Controllers : exposition des endpoints REST
- Services : logique métier
- Repositories : accès aux données via JPA
- DTO & Mappers : découplage des modèles internes / externes
  
Services transverses :
- Gestion centralisée des erreurs (DTO standardisés)
- Centralisation des messages applicatifs
- Gestion des emails (Spring Mail + Thymeleaf)

### Base de données
- **MySQL** : Modélisation relationnelle des entités métier
- **Flyway** : Versioning et exécution automatique des migrations de base de données

---

## SECURITE
Authentification basée sur **JWT** :
- JWT stocké en **cookies HTTP-only**
- Durée de vie courte de l’access token
- Rotation des **refresh tokens** 
  
Sécurisation de l’API :
- Protection via **Spring Security**
- API **Stateless** (aucune session côté serveur)
- Configuration CORS sécurisée 
- Contrôle des accès basé sur les rôles (USER / ADMIN)
  
Protection des entrées :
- Utilisation de l'ORM **JPA / Hibernate** avec requêtes paramétrées (réduction des risques d’injection SQL)
- Validation des données via les **Bean Validation** et les **DTO**

Protection des données sensibles :
- Hashage des mots de passe
- Utilisation de variables d’environnement
- Aucune donnée sensible exposée côté client

---
    
## UI & UX

Le front-end a été développé selon une approche **mobile-first**, en combinant :

- **Angular Material** pour garantir une cohérence visuelle, une bonne accessibilité et des composants UI robustes, 
conformes aux standards (navigation clavier, gestion du focus, contrastes) et reposant sur une structuration sémantique adaptée.

- **Tailwind CSS** pour la mise en page et le responsive. L’interface est ensuite adaptée aux écrans tablette et desktop grâce aux breakpoints Tailwind, 
complétés ponctuellement par des **media queries personnalisées** lorsque nécessaire.

---

## INSTALLATION

```bash
git clone https://github.com/EnnioPilia/MeetMates.git
cd MeetMates
```

### Prérequis
- Node.js >= 22
- Angular CLI >= 19
- Java JDK 17+
- Maven
- MySQL
- Docker (optionnel)

---

### Installation du back-end

```bash
cd MeetMatesBACK
mvn clean install
```

### Variables d’environnement

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

###  Lancer le back-end

```bash
mvn spring-boot:run
```

### API accessible à l’adresse :

http://localhost:8080

---

###  Installation du front-end

```bash
cd MeetMatesFRONT
npm install
```

###  Lancer le front-end

```bash
ng serve
```

### Application accessible à l’adresse :

http://localhost:4200

---

## DÉPLOIEMENT (anciennement en production / projet de formation terminé)

Architecture applicative structurée et prête pour la production 

### Infrastructure
  - Serveur distant (VPS)
  - Connexion sécurisée via SSH (clé privée)
  - Reverse proxy (Nginx)
  - Déploiement via Docker
  - Pipeline CI/CD avec GitHub Actions
          
### Sécurité 
  - Accès serveur restreint par clé SSH
  - Aucune donnée sensible stockée en dur
  - Variables sécurisées via GitHub Secrets
  - Authentification JWT avec cookies HTTP-only

---

## DOCKER 
L’application peut être exécutée via Docker afin de garantir un environnement isolé, reproductible et conforme aux standards professionnels. 

### Services conteneurisés :
  - Backend Spring Boot
  - Base de données MySQL
  - Frontend Angular
       
Chaque service dispose de son propre Dockerfile. Les images sont construites en utilisant des builds multi-stage 

### Orchestration :
Un fichier docker-compose.yml permet de lancer l’ensemble des services avec leurs dépendances :

```bash
docker compose up --build
```

--- 

## CI/CD
Un pipeline d’intégration continue et de déploiement continu est mis en place via GitHub Actions. 

### Intégration Continue (CI)

À chaque `push` ou `pull request` : 

- Installation des dépendances
- Compilation du projet
- Exécution des tests unitaires
- Vérification du build
      
### Déploiement Continu (CD)

Le déploiement est automatisé en fonction de la branche ciblée (main) :
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
---

## Conclusion

Ce projet met l’accent sur :
- la **sécurité** des échanges 
- la **maintenabilité** du code grâce à une architecture claire et modulaire
- l’utilisation de **technologies modernes full-stack** 
- une **expérience utilisateur fluide et accessible**, pensée dès la conception

Meet Mates a été conçu comme une application évolutive, pouvant être enrichie
de nouvelles fonctionnalités et déployée dans un environnement professionnel

---

## Auteur

PILIA Ennio
 Développeur Fullstack 


