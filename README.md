
# 💅 NailFinder – Gestion intelligente de salons de manucure

**NailFinder** est une application dédiée à la gestion des salons de manucure, pédicure et autres soins des ongles. Elle a été conçue pour faciliter le quotidien des propriétaires de salons tout en améliorant l’expérience client grâce à un système de réservation moderne, efficace et intelligent.

## ⏳ Have some time?

### ✅ YES  
Parfait ! Faites défiler pour découvrir le projet plus en détail.

### ❌ NO  
Pas de souci, le projet n'est pas encore dockerisé.  
Lancez simplement le script `bash INITIATOR.sh` pour démarrer rapidement.

 
### Objectifs

* Simplifier la **gestion des rendez-vous** pour les salons
* Réduire les **temps d’attente** pour les clients
* Éviter les **annulations de dernière minute**
* Offrir une **interface claire et personnalisable** pour tous les utilisateurs

---

### 🔧 Stack technique

| Domaine             | Technologies principales                 |
| ------------------- | ---------------------------------------- |
| **Back-end**        | NestJS (Node.js), TypeScript             |
| **Base de données** | PostgreSQL (requêtes RAW)                |
| **Cache / Queues**  | Redis                                    |
| **API**             | REST  |
| **Auth**            | JWT, rôles et guards via NestJS          |
| **CI/CD**           | GitHub + GitHub Actions (prévu en V2)    |

---

### 📱 Front-end

| Application            | Stack                                      |
| ---------------------- | ------------------------------------------ |
| **App Client**         | Flutter (MOBILE DEV PART )        |
| **App Salon**          | Flutter (MOBILE DEV PART )   |
| **Dashboard Web (V2)** | Next.js, Tailwind CSS, Shadcn UI, NextAuth |

---

### 🧠 Fonctionnalités principales

* **Authentification sécurisée** par token email (valide 5 min)
* **Planning personnalisable** (jours et horaires d’ouverture)
* **Réservation intelligente** avec timeout automatique (15 min)
* **Système de pénalités** (points déduits en cas de no-show ou d’annulation tardive)
* **Suivi des rendez-vous** pour clients et salons
* **Gestion des images** (galerie jusqu’à 8 photos par salon)
* **Avis et notations** avec mise à jour dynamique des notes
* **Système de filtres** pour rechercher un salon selon critères (proximité, note, disponibilités...)

---

### 🔁 Logique de réservation

```text
FREE → RESERVED → REQUESTED → CONFIRMED 
           ↘ CANCELLED (client/salon)
```

* ⏱ Si un client ne confirme pas sa réservation dans les 15 minutes → créneau libéré
* ❌ Annulation tardive (< 2h avant) → pénalité automatique
* ✅ Confirmation obligatoire par le salon pour valider définitivement le rendez-vous

---

### 📂 Structure des images

```bash
Images/
├── Salons/
│   ├── [salon_id]/image1.jpg → image8.jpg
├── Comments/
├── ClientProfile/
```

Chaque salon peut uploader jusqu’à 8 images, stockées dans une arborescence organisée par ID.

---

### 🔐 API Gateway

**Endpoints client** (`/api/v1/client`) :

* Voir salons proches / mieux notés / selon préstation
* Réserver un créneau
* Annuler / confirmer un RDV
* Gérer son profil, consulter l’historique
* Noter un salon

**Endpoints salon** (`/api/v1/salon`) :

* Gérer sa fiche, ses horaires et ses prestations
* Voir et gérer les réservations
* Répondre aux commentaires
* Accéder à ses statistiques

---

### 🚀 Pourquoi ce projet ?

Ce projet met en avant mes compétences de **développeur back-end** :
* Love coding
* Conception d’API REST avec **NestJS**
* Mise en place de **logiques métier complexes**
* Authentification et sécurité des accès
* Gestion **asynchrone** (Redis / timeout / pénalités)
* Intégration facile avec des clients front-end mobiles et web

---

