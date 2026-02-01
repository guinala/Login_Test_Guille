import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

const firebaseConfig = 
{
    apiKey: "AIzaSyDIdY15uPunXAeUUiyC8uhGxSmVXZ9VAmM",
    authDomain: "guill23-test.firebaseapp.com",
    projectId: "guill23-test",
    storageBucket: "guill23-test.firebasestorage.app",
    messagingSenderId: "77718658297",
    appId: "1:77718658297:web:cc23c3ee22e73ced225628",
    measurementId: "G-ZZNDRPCE4Y"
};

//Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginScreen = document.getElementById('login-screen');
const registerScreen = document.getElementById('register-screen');
const userScreen = document.getElementById('user-screen');
const loadingScreen = document.getElementById('loading-screen');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const googleBtn = document.getElementById('google-btn');
const logoutBtn = document.getElementById('logout-btn');

const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');

const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');
const googleError = document.getElementById('google-error');
const userEmail = document.getElementById('user-email');
const userProvider = document.getElementById('user-provider');

function showScreen(screen) 
{
    loginScreen.classList.add('hidden');
    registerScreen.classList.add('hidden');
    userScreen.classList.add('hidden');
    loadingScreen.classList.add('hidden');
    screen.classList.remove('hidden');
}

function getErrorMessage(errorCode) 
{
    const errors = 
    {
        'auth/email-already-in-use': 'Este email ya está registrado',
        'auth/invalid-email': 'Email inválido',
        'auth/operation-not-allowed': 'Operación no permitida',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
        'auth/user-disabled': 'Usuario deshabilitado',
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/invalid-credential': 'Credenciales inválidas',
        'auth/popup-closed-by-user': 'Popup cerrado por el usuario',
        'auth/cancelled-popup-request': 'Solicitud cancelada'
    };
    return errors[errorCode] || 'Error: ' + errorCode;
}

showRegisterLink.addEventListener('click', () => {
    showScreen(registerScreen);
    registerError.textContent = '';
    googleError.textContent = '';
});

showLoginLink.addEventListener('click', () => {
    showScreen(loginScreen);
    loginError.textContent = '';
    googleError.textContent = '';
});

// Registro
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    registerError.textContent = '';

    try 
    {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Usuario registrado:', userCredential.user);
    } 
    catch (error) 
    {
        registerError.textContent = getErrorMessage(error.code);
        console.error('Error en registro:', error);
    }
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    loginError.textContent = '';

    try 
    {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Usuario logueado:', userCredential.user);
    } 
    catch (error) 
    {
        loginError.textContent = getErrorMessage(error.code);
        console.error('Error en login:', error);
    }
});

// Google
googleBtn.addEventListener('click', async () => {
    const googleProvider = new GoogleAuthProvider();
    googleError.textContent = '';
    try 
    {
        const result = await signInWithPopup(auth, googleProvider);
        console.log('Usuario logueado con Google:', result.user);
    } 
    catch (error) 
    {
        googleError.textContent = getErrorMessage(error.code);
        console.error('Error en login con Google:', error);
    }
});

// Cerrar sesión
logoutBtn.addEventListener('click', async () => {
    try 
    {
        await signOut(auth);
        console.log('Usuario deslogueado');
    } 
    catch (error) 
    {
        console.error('Error al cerrar sesión:', error);
    }
});

// Estado
onAuthStateChanged(auth, (user) => {
    if (user) 
    {
        console.log('Usuario autenticado:', user);
        userEmail.textContent = `Email: ${user.email}`;
        
        const providerData = user.providerData[0];
        if (providerData) 
        {
            const provider = providerData.providerId === 'google.com' ? 'Google' : 'Email/Password';
            userProvider.textContent = `Proveedor: ${provider}`;
        }
        
        showScreen(userScreen);
        googleBtn.classList.add('hidden');
    } 
    else 
    {
        console.log('Usuario no autenticado');
        showScreen(loginScreen);
        googleBtn.classList.remove('hidden');
    }
});