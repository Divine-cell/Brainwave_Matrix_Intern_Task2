# eConnect -  Real-time Chat Application

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

## Technology Used
- **HTML**
- **CSS**
- **JavaScript**
- **Firebase Authentication**   
- **Cloud Firestore** 
- **Firebase Hosting**
  <img width="1366" height="676" alt="Screenshot 2025-08-05 000335" src="https://github.com/user-attachments/assets/2ba071ad-a61c-4ebb-b2c5-4bf665089ae3" />
  
## Hosted Real-time Chat Web App
eConnect: https://econnect-96da4.web.app/
  




