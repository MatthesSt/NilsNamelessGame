import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  getFirestore,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
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

export interface game {
  id: string;
  title: string;
  user1: Player;
  user2: Player;
  usedTiles: {
    x: number;
    y: number;
    cards: card[];
    player: number;
  }[];
  turns: number;
  next: boolean;
  player: number;
  skipped: boolean;
  skippedBy: number;
}
export interface tile {
  x: number;
  y: number;
  cards: card[];
}
export interface Player {
  id: string;
  name: string;
  deck: {
    cards: { id: string }[];
    name: string;
  };
  handcards: card[];
  discarded: card[];
  mana: number;
}
export interface layout {
  fields: {
    type: string;
  }[][];
}
export interface equipable {
  fields: point[];
}
export interface point {
  x: number;
  y: number;
}

export const userRole = ref("");

//accounts
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
export async function getUsername(): Promise<string> {
  const docs: QueryDocumentSnapshot<DocumentData>[] = [];

  const id = currentUser.value?.uid;
  const querySnapshot = await getDocs(collection(getFirestore(), "users"));
  querySnapshot.forEach(doc => {
    docs.push(doc);
  });
  const users = docs.map(users => ({ ...users.data(), id: users.id })) as user[];
  return users.filter(user => user.id == id)[0]?.username;
}

//Cards
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

//Decks
export async function setDecks(Decks: deck[]): Promise<void> {
  const uid = currentUser.value?.uid;
  if (uid)
    await updateDoc(doc(getFirestore(), "users", uid), {
      decks: Decks,
    });
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

//Game
export async function createGame(gameTitle: string): Promise<void> {
  const docRef = await setDoc(doc(getFirestore(), "games", gameTitle + "fuid"), {
    title: gameTitle,
    user1: "",
    user2: "",
    player: 1,
    usedTiles: [],
    turns: 0,
    next: true,
    skipped: false,
    skippedBy: 0,
  });
}

export async function getGames(): Promise<any> {
  const docs: QueryDocumentSnapshot<DocumentData>[] = [];
  const querySnapshot = await getDocs(collection(getFirestore(), "games"));
  querySnapshot.forEach(doc => {
    docs.push(doc);
  });
  return docs.map(game => ({ ...game.data(), id: game.id })) as unknown as game[];
}

export async function joinGame(gameID: string, userID: string, username: string, selectedDeck: deck): Promise<void> {
  const game = (await getDoc(doc(getFirestore(), "games", gameID))).data() as unknown as game;
  console.log(game);
  await updateDoc(doc(getFirestore(), "games", gameID), {
    user1: game.user1 || { id: userID, name: username, deck: selectedDeck },
    user2: game.user2 || game.user1 ? { id: userID, name: username, deck: selectedDeck } : "",
  });
}

export async function updateGame(game: game): Promise<void> {
  await updateDoc(doc(getFirestore(), "games", game.id), { ...game });
}
