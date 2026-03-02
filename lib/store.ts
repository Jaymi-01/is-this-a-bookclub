import { create } from "zustand";
import { db } from "./firebase";
import { doc, onSnapshot, setDoc, arrayUnion } from "firebase/firestore";

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  dateRead?: string;
  summary?: string;
  rating?: number;
}

interface BookStore {
  currentBook: Book;
  pastBooks: Book[];
  meetingDate: string;
  badgeText: string;
  booksFinished: number;
  activeMembers: number;
  communityImage: string;
  loading: boolean;
  
  // Actions
  init: () => void;
  setCurrentBook: (book: Book) => Promise<void>;
  addPastBook: (book: Book) => Promise<void>;
  setMeetingDate: (date: string) => Promise<void>;
  setBadgeText: (text: string) => Promise<void>;
  setBooksFinished: (count: number) => Promise<void>;
  setActiveMembers: (count: number) => Promise<void>;
  setCommunityImage: (url: string) => Promise<void>;
}

const DEFAULT_CURRENT: Book = {
  id: "current",
  title: "Next Pick TBD",
  author: "TBD",
  cover: "https://via.placeholder.com/400x600?text=ITABC+Next+Pick",
};

export const useBookStore = create<BookStore>((set) => ({
  currentBook: DEFAULT_CURRENT,
  pastBooks: [],
  meetingDate: "",
  badgeText: "NEXT PICK!",
  booksFinished: 0,
  activeMembers: 0,
  communityImage: "https://via.placeholder.com/1200x800?text=ITABC+Community+Photo",
  loading: true,

  init: () => {
    const unsub = onSnapshot(doc(db, "siteContent", "main"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        set({
          currentBook: data.currentBook || DEFAULT_CURRENT,
          pastBooks: data.pastBooks || [],
          meetingDate: data.meetingDate || "",
          badgeText: data.badgeText || "NEXT PICK!",
          booksFinished: data.booksFinished ?? 0,
          activeMembers: data.activeMembers ?? 0,
          communityImage: data.communityImage || "https://via.placeholder.com/1200x800?text=ITABC+Community+Photo",
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    }, (error) => {
      console.error("Firestore Read Error:", error);
      set({ loading: false });
    });
    return unsub;
  },

  setCurrentBook: async (book) => {
    await setDoc(doc(db, "siteContent", "main"), { currentBook: book }, { merge: true });
  },

  addPastBook: async (book) => {
    await setDoc(doc(db, "siteContent", "main"), {
      pastBooks: arrayUnion(book)
    }, { merge: true });
  },

  setMeetingDate: async (date) => {
    await setDoc(doc(db, "siteContent", "main"), { meetingDate: date }, { merge: true });
  },

  setBadgeText: async (text) => {
    await setDoc(doc(db, "siteContent", "main"), { badgeText: text }, { merge: true });
  },

  setBooksFinished: async (count) => {
    await setDoc(doc(db, "siteContent", "main"), { booksFinished: count }, { merge: true });
  },

  setActiveMembers: async (count) => {
    await setDoc(doc(db, "siteContent", "main"), { activeMembers: count }, { merge: true });
  },

  setCommunityImage: async (url) => {
    await setDoc(doc(db, "siteContent", "main"), { communityImage: url }, { merge: true });
  },
}));
