import { addDoc, collection, deleteDoc, doc, DocumentData, getDoc, getDocs, getFirestore, QueryDocumentSnapshot, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { currentUser } from "./src/router";
import { ref } from "vue";

interface user {
  username: string;
  email: string;
  role: string;
  id: string;
  decks: deck[];
}
export interface deck {
  cards: card[];
  name: string;
  size: number;
}
export interface card {
  id: string;
  name: string;
  description: string;
  manacost: number;
  type: "unit" | "strategy" | "nebula" | "equipment" | "event";
  discardAfterUse: boolean;
  hp: number;
  armor: number;
  movement: number;
  range: number;
  tp: number;
  effect: effect;
  up: sideBuff;
  left: sideBuff;
  right: sideBuff;
  down: sideBuff;
}
export interface effect {
  type: "buff" | "heal" | "dmg";
  amount: number;
  stat: "TP" | "HP" | "A" | "R" | "M";
}
export interface sideBuff {
  type: "stat" | "trait";
  trait: "test1" | "priest";
  amount: number;
  stat: "TP" | "HP" | "A" | "R" | "M";
}

export const userRole = ref("");

export async function login(email: string, password: string): Promise<boolean> {
  const auth = getAuth();
  if (await signInWithEmailAndPassword(auth, email, password)) {
    localStorage.setItem("Username", await getUsername());
    return true;
  }
  return false;
}

export async function logout(): Promise<void> {
  const auth = getAuth();
  await signOut(auth);
  currentUser.value = null;
  localStorage.removeItem("Username");
}

export async function register(email: string, password: string, username: string): Promise<void> {
  const auth = getAuth();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(getFirestore(), "users", userCredential.user.uid), {
    email: email,
    role: "user",
    username: username,
  });
}
export async function getUsername(): Promise<any> {
  const docs: QueryDocumentSnapshot<DocumentData>[] = [];
  const id = getAuth().currentUser?.uid;
  const querySnapshot = await getDocs(collection(getFirestore(), "users"));
  querySnapshot.forEach(doc => {
    docs.push(doc);
  });
  const users = docs.map(users => ({ ...users.data(), id: users.id })) as user[];
  return users.filter(user => user.id == id)[0].username;
}

export async function getDecks(): Promise<deck[]> {
  const docs: QueryDocumentSnapshot<DocumentData>[] = [];
  const id = getAuth().currentUser?.uid;
  const querySnapshot = await getDocs(collection(getFirestore(), "users"));
  querySnapshot.forEach(doc => {
    docs.push(doc);
  });
  const users = docs.map(users => ({ ...users.data(), id: users.id })) as user[];
  return users.filter(user => user.id == id)[0].decks as deck[];
}
export async function setCard(Card: card): Promise<any> {
  await setDoc(doc(getFirestore(), "cards", Card.id), {
    ...Card,
  });
}

export async function getCards(): Promise<card[]> {
  const docs: QueryDocumentSnapshot<DocumentData>[] = [];
  const querySnapshot = await getDocs(collection(getFirestore(), "cards"));
  querySnapshot.forEach(doc => {
    docs.push(doc);
  });
  return docs.map(card => ({ ...card.data(), id: card.id })) as unknown as card[];
}

export async function deleteCard(id: string): Promise<void> {
  await deleteDoc(doc(getFirestore(), "cards", id));
}

export async function getGame(): Promise<any> {
  const game = await getDocs(collection(getFirestore(), "game"));
  return game;
}
