import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, addDoc, query, orderBy, onSnapshot, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// firebase app config
const firebaseConfig = {
  apiKey: "AIzaSyC-cUhJ-OUH_uB9upM0_M4JPcBjdpHpa78",
  authDomain: "econnect-96da4.firebaseapp.com",
  projectId: "econnect-96da4",
  storageBucket: "econnect-96da4.firebasestorage.app",
  messagingSenderId: "190744335323",
  appId: "1:190744335323:web:af948d73311d7e447fcdfe",
};

// initialize firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signupContainer = document.getElementById("Signup_container")
const loginContainer = document.getElementById("Login_container")
const chatConatiner = document.getElementById("chat_conatiner")

const toLogin = document.getElementById("to_login")
const toSignup = document.getElementById("to_signup")

const signUp = document.getElementById("signup_btn")
const logIn = document.getElementById("Login_btn")
const logOut = document.getElementById("LogOut")
const send = document.getElementById("send_btn")

const firstName = document.getElementById("first_name")
const lastName = document.getElementById("last_name")
const signUpEmail = document.getElementById("signup_email")
const signupPassword = document.getElementById("signup_password")

const loginEmail = document.getElementById("login_email")
const loginPassword = document.getElementById("login_password")

const messageInput = document.getElementById("message_input")
const avater = document.getElementById("avatar")
const message = document.getElementById("message")

toLogin?.addEventListener("click", (e) =>{
    e.preventDefault()
    signupContainer.classList.add("hidden")
    loginContainer.classList.remove("hidden")
})

toSignup?.addEventListener("click", (e) =>{
    e.preventDefault()
    loginContainer.classList.add("hidden")
    signupContainer.classList.remove("hidden")
})

// function to get the intials from user name
const first_name = firstName.value.trim()
const last_name = lastName.value.trim()
const fullName = [first_name, last_name].filter(Boolean).join(" ")

function getInitials(fullName) {
    return fullName
    .trim()
    .split(/\s+/)
    .map(n => n[0] || "")
    .slice(0,2)
    .join("")
    .toUpperCase()
}


// signup btn handler
signUp.addEventListener("click", async () => {
    const first_name = firstName.value.trim()
    const last_name = lastName.value.trim()
    const fullName = [first_name, last_name].filter(Boolean).join(" ")
    const password = signupPassword.value
    const email = signUpEmail.value.trim()

    if (!first_name || !last_name || !email || !password) {
        alert("All fields required")
        return
    }

    try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCred.user
        const nameEntered = fullName
        const initials = getInitials(nameEntered)

        await setDoc(doc(db, "users", user.uid), {
            fullName: nameEntered,
            initials,
            email,
            createdAt: serverTimestamp()
        })

        await updateProfile(user, {displayName: nameEntered})

       await signOut(auth)

        setTimeout(() => {
            signupContainer.classList.add("hidden")
            loginContainer.classList.remove("hidden")
        }, 100);

    } catch (err){
        if(err.code === "auth/email-already-in-use") {
            alert("This email is already registered. Please log in instead")
        } else {
            alert(err.message)  
        }
    }  
})

logIn.addEventListener("click", async () => {
    const email = loginEmail.value.trim()
    const password = loginPassword.value
    if (!email || !password) {
        alert("All fields required")
        return
    }
    try {
        await signInWithEmailAndPassword(auth, email, password)
        loginEmail.value = ""
        loginPassword.value = ""

        loginContainer.classList.add("hidden")
        chatConatiner.classList.remove("hidden")

    } catch (err){
        alert(err.message)
    }
})

logOut.addEventListener("click", async() =>{
    await signOut(auth)

    setTimeout(() => {
        chatConatiner.classList.add("hidden")
        loginContainer.classList.remove("hidden")

    }, 300);

})

onAuthStateChanged(auth, async(user) => {
    if (user) {
        signupContainer.classList.add("hidden")
        loginContainer.classList.remove("hidden")
        chatConatiner.classList.add("hidden")

        loginEmail.value = ""
        loginPassword.value = ""

        const userDoc = await getDoc(doc(db, "users", user.uid))
        const profile = userDoc.exists() ? userDoc.data() : {}
        const fullName = profile.fullName || user.displayName || "Anonymous"
        const initials = profile.initials || getInitials(fullName)

        subscribeMessages()
    } else {
        chatConatiner.classList.add("hidden")
        loginContainer.classList.remove("hidden")
        signupContainer.classList.add("hidden")
    }
})

let unsubscribeMessages = null;
function subscribeMessages() {
  if (unsubscribeMessages) unsubscribeMessages();
  const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
  unsubscribeMessages = onSnapshot(q, (snapshot) => {
    message.innerHTML = "";
    snapshot.forEach(docSnap => {
        const msg = docSnap.data();
        const msgEl = document.createElement("div");
        msgEl.classList.add("message");
        msgEl.style.display = "flex";
        msgEl.style.alignItems = "flex-start";
        msgEl.style.marginBottom = "8px";

      const avatar = document.createElement("div");
      avatar.textContent = msg.initials || "?";
      avatar.style.width = "35px"
      avatar.style.height = "35px"
      avatar.style.background = "rgb(189, 188, 188)"
      avatar.style.borderRadius = "50%"
      avatar.style.margin = "15px 8px 5px 0"
      avatar.style.display = "flex"
      avatar.style.alignItems = "center"
      avatar.style.justifyContent = "center"
    

      const bubble = document.createElement("div");
      bubble.classList.add("chat-bubble");
      bubble.style.background = "#f1f1f1";
      bubble.style.padding = "10px";
      bubble.style.borderRadius = "8px";
      bubble.style.maxWidth = "70%";
      bubble.innerHTML = `
        <div style="font-weight:600; margin-bottom:4px;">${msg.fullName || "Unknown"}</div>
        <div>${msg.text || ""}</div>
        <div style="font-size:10px; color:#666; margin-top:4px;">${msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString() : ""}</div>
      `;

      msgEl.appendChild(avatar);
      msgEl.appendChild(bubble);
      message.appendChild(msgEl);
      message.scrollTop = message.scrollHeight;
    });
  });
}

send.addEventListener("click", async() => {
    const text = messageInput.value.trim()
    const user = auth.currentUser
    if (!user || !text) return

    const userDoc = await getDoc(doc(db, "users", user.uid))
    const profile = userDoc.exists() ? userDoc.data() : {}
    const fullName = profile.fullName || user.displayName || "Anonymous"
    const initials = profile.initials || getInitials(fullName)

    try {
        await addDoc(collection(db, "messages"), {
            text, fullName, initials, uid: user.uid, createdAt: serverTimestamp()
        })
        messageInput.value = ""
    } catch (err){
        console.error("send error", err)
    }
})
