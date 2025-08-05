# eConnect — Real-time Chat Application

A real-time chat application built with **Firebase Authentication** and **Cloud Firestore**, deployed to **Firebase Hosting**.  
Users sign up with first/last name, log in with email/password, and exchange messages instantly. Each message shows the sender's initials as an avatar.

## Features
- Email/password **authentication** using Firebase Auth  
- User profile stored in Firestore: full name + initials  
- **Real-time group chat** by Firestore `onSnapshot` listeners  
- Message avatars generated from user initials  
- Firestore security rules: users can only manage their own profile; authenticated users can read/write chat messages  
- Deployment via Firebase Hosting  

## Architecture Overview
- Frontend (HTML/CSS/JS)
- Firebase Auth - user sign-up/login
- Cloud Firestore that stores users data
- Firebase Hosting ← serves the UI

## Tech Stack
- **Firebase Authentication** – user identity  
- **Cloud Firestore** – real-time message & profile storage  
- **Firebase Hosting** – static site deployment  
- **Vanilla JavaScript / HTML / CSS** – frontend UI  
- **No build step required** (unless you add a framework later)  


