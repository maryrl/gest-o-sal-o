
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🧠 Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBRQxgbJ1PiZaWRXZrwo4tlDPkX6EGIKGY",
  authDomain: "adm2025-3dbc4.firebaseapp.com",
  projectId: "adm2025-3dbc4",
  storageBucket: "adm2025-3dbc4.firebasestorage.app",
  messagingSenderId: "599128695239",
  appId: "1:599128695239:web:dcd8570faa0009f47879e2",
  measurementId: "G-6Q57H5PKF2",
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 Elementos
const loginSection = document.getElementById("login-section");
const bookingSection = document.getElementById("booking-section");
const adminPanel = document.getElementById("admin-panel");
const logoutBtn = document.getElementById("logout-btn");
const notification = document.getElementById("notification");
const tableBody = document.querySelector("#appointments-table tbody");
const totalCount = document.getElementById("total-count");

// 🔹 Mostrar notificação
function showNotification(msg) {
  notification.textContent = msg;
  notification.classList.remove("hidden");
  setTimeout(() => notification.classList.add("hidden"), 4000);
}

// 🔹 Login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target["login-email"].value;
  const password = e.target["login-password"].value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    showNotification("Login realizado com sucesso!");
  } catch (err) {
    showNotification("Falha no login!");
  }
});

// 🔹 Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  showNotification("Sessão encerrada!");
});

// 🔹 Autenticação
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginSection.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
  } else {
    loginSection.classList.remove("hidden");
    adminPanel.classList.add("hidden");
    logoutBtn.classList.add("hidden");
  }
});

// 🔹 Agendamento
document.getElementById("booking-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target).entries());

  try {
    await addDoc(collection(db, "agendamentos"), formData);
    showNotification("Agendamento realizado com sucesso!");
    e.target.reset();
  } catch (err) {
    console.error(err);
    showNotification("Erro ao agendar!");
  }
});

// 🔹 Atualizar tabela admin em tempo real
onSnapshot(collection(db, "agendamentos"), (snapshot) => {
  tableBody.innerHTML = "";
  let count = 0;
  snapshot.forEach((docSnap) => {
    count++;
    const ag = { id: docSnap.id, ...docSnap.data() };
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td data-label="Nome">${ag.nome}</td>
      <td data-label="Telefone">${ag.telefone}</td>
      <td data-label="Data">${ag.data}</td>
      <td data-label="Hora">${ag.hora}</td>
      <td data-label="Serviço">${ag.servico}</td>
      <td><button data-id="${ag.id}" class="delete-btn">Excluir</button></td>
    `;

    tableBody.appendChild(tr);
  });
  totalCount.textContent = count;
});

// 🔹 Excluir agendamento
tableBody.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id;
    await deleteDoc(doc(db, "agendamentos", id));
    showNotification("Agendamento removido!");
  }
});
