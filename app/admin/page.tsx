"use client";

import { useState, useEffect } from "react";
import { useBookStore } from "@/lib/store";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, setPersistence, browserSessionPersistence, User } from "firebase/auth";
import { toast } from "react-hot-toast";
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Plus, 
  FloppyDisk,
  Archive,
  TrendUp,
  Users,
  WhatsappLogo,
  Envelope,
  SignOut,
  LockKey,
  CircleNotch,
  Download,
  House,
  Camera,
  PencilLine,
  Trash
} from "@phosphor-icons/react";
import Link from "next/link";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

interface Submission {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  favoriteGenre: string;
  createdAt: Timestamp | null;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // SECURITY: Honeypot and Rate Limiting
  const [honeypot, setHoneypot] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  const { 
    currentBook, setCurrentBook, 
    pastBooks, setPastBooks,
    addPastBook, 
    meetingDate, setMeetingDate, 
    badgeText, setBadgeText, 
    booksFinished, setBooksFinished, 
    activeMembers, setActiveMembers,
    communityImage, setCommunityImage,
    signatures, setSignatures,
    init 
  } = useBookStore();

  const [bookForm, setBookForm] = useState({ ...currentBook });
  const [currentBadge, setCurrentBadge] = useState(badgeText);
  const [finishedCount, setFinishedCount] = useState(booksFinished);
  const [membersCount, setMembersCount] = useState(activeMembers);
  const [communityImageUrl, setCommunityImageUrl] = useState(communityImage);
  const [signatureText, setSignatureText] = useState(signatures.join(", "));
  const [pastBookForm, setPastBookForm] = useState({
    title: "", author: "", cover: "", summary: "", rating: 5, dateRead: "Feb 2026"
  });
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [editBookForm, setEditBookForm] = useState<any>(null);

  const [customMeetingDate, setCustomMeetingDate] = useState(meetingDate);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthLoading(false);
      if (u) init();
    });
    return () => {
      unsub();
      // SECURITY: Force logout on exit
      signOut(auth);
    };
  }, [init]);

  useEffect(() => {
    setBookForm({ ...currentBook });
  }, [currentBook]);

  useEffect(() => {
    setCurrentBadge(badgeText);
  }, [badgeText]);

  useEffect(() => {
    setFinishedCount(booksFinished);
  }, [booksFinished]);

  useEffect(() => {
    setMembersCount(activeMembers);
  }, [activeMembers]);

  useEffect(() => {
    setCommunityImageUrl(communityImage);
  }, [communityImage]);

  useEffect(() => {
    setSignatureText(signatures.join(", "));
  }, [signatures]);

  useEffect(() => {
    setCustomMeetingDate(meetingDate);
  }, [meetingDate]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "submissions"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSubmissions(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Submission)));
    });
    return () => unsubscribe();
  }, [user]);

  // SECURITY: Activity Logger
  const logActivity = async (action: string, details: string) => {
    try {
      await addDoc(collection(db, "activityLogs"), {
        admin: auth.currentUser?.email,
        action,
        details,
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.error("Audit log failed", e);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (honeypot) return;

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (cooldown > Date.now()) {
      toast.error(`Locked. Try again in ${Math.ceil((cooldown - Date.now())/1000)}s`);
      return;
    }

    setIsLoggingIn(true);
    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      setFailedAttempts(0);
      toast.success("Authorized");
      logActivity("LOGIN", "Admin logged in successfully");
    } catch (error) {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      if (attempts >= 3) {
        setCooldown(Date.now() + 60000);
        toast.error("Security Lockout: 1 minute.");
      } else {
        toast.error("Invalid credentials.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => signOut(auth);

  const handleUpdateCurrent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction("spotlight");
    try {
      await setCurrentBook(bookForm);
      toast.success("Spotlight updated!");
      logActivity("UPDATE_SPOTLIGHT", `Changed book to: ${bookForm.title}`);
    } catch (error: unknown) {
      const e = error as Error;
      toast.error(`Error: ${e.message}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUpdateBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction("badge");
    try {
      await setBadgeText(currentBadge);
      toast.success("Badge updated!");
      logActivity("UPDATE_BADGE", `Changed badge text to: ${currentBadge}`);
    } catch (error: unknown) {
      const e = error as Error;
      toast.error(`Error: ${e.message}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUpdateStats = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction("stats");
    try {
      await setBooksFinished(finishedCount);
      await setActiveMembers(membersCount);
      toast.success("Stats updated!");
      logActivity("UPDATE_STATS", `Books: ${finishedCount}, Members: ${membersCount}`);
    } catch (error: unknown) {
      const e = error as Error;
      toast.error(`Error: ${e.message}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUpdateTimer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction("timer");
    try {
      await setMeetingDate(customMeetingDate);
      toast.success("Timer updated!");
      logActivity("UPDATE_TIMER", `Set next meeting to: ${customMeetingDate}`);
    } catch (error: unknown) {
      const e = error as Error;
      toast.error(`Error: ${e.message}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUpdateCommunityImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction("community");
    try {
      await setCommunityImage(communityImageUrl);
      toast.success("Community vibe updated!");
      logActivity("UPDATE_COMMUNITY_IMAGE", "Changed community group photo");
    } catch (error: unknown) {
      const e = error as Error;
      toast.error(`Error: ${e.message}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUpdateSignatures = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction("signatures");
    try {
      const names = signatureText.split(",").map(s => s.trim()).filter(s => s !== "");
      await setSignatures(names);
      toast.success("Signature wall updated!");
      logActivity("UPDATE_SIGNATURES", `Updated ${names.length} signatures`);
    } catch (error: unknown) {
      const e = error as Error;
      toast.error(`Error: ${e.message}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleArchiveCurrent = async () => {
    if (window.confirm("Move to archive?")) {
      setLoadingAction("archiving");
      try {
        await addPastBook({ ...currentBook, id: Math.random().toString(), dateRead: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), rating: 4.5, summary: "Completed Pick." });
        await setCurrentBook({ id: "current", title: "TBD", author: "TBD", cover: "https://placehold.co/400x600?text=Next+Pick" });
        toast.success("Archived!");
        logActivity("ARCHIVE_BOOK", `Archived: ${currentBook.title}`);
    } catch (error: unknown) {
      const e = error as Error;
      toast.error(`Error: ${e.message}`);
    } finally {
        setLoadingAction(null);
      }
    }
  };

  const handleDeletePastBook = async (id: string) => {
    if (window.confirm("Delete this book from archive?")) {
      setLoadingAction(`delete-past-${id}`);
      try {
        const updatedBooks = pastBooks.filter(b => b.id !== id);
        await setPastBooks(updatedBooks);
        toast.success("Book removed from archive");
        logActivity("DELETE_PAST_BOOK", `Removed book ID: ${id}`);
      } catch (error: unknown) {
        const e = error as Error;
        toast.error(`Error: ${e.message}`);
      } finally {
        setLoadingAction(null);
      }
    }
  };

  const handleStartEdit = (book: any) => {
    setEditingBookId(book.id);
    setEditBookForm({ ...book });
  };

  const handleCancelEdit = () => {
    setEditingBookId(null);
    setEditBookForm(null);
  };

  const handleUpdatePastBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBookId) return;
    setLoadingAction(`update-past-${editingBookId}`);
    try {
      const updatedBooks = pastBooks.map(b => b.id === editingBookId ? editBookForm : b);
      await setPastBooks(updatedBooks);
      toast.success("Book updated!");
      logActivity("UPDATE_PAST_BOOK", `Updated book: ${editBookForm.title}`);
      setEditingBookId(null);
      setEditBookForm(null);
    } catch (error: unknown) {
      const e = error as Error;
      toast.error(`Error: ${e.message}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDownloadExcel = () => {
    if (submissions.length === 0) {
      toast.success("No requests to download.");
      return;
    }
    logActivity("DOWNLOAD_CSV", `Downloaded ${submissions.length} member requests`);

    const headers = ["Name", "Email", "WhatsApp", "Favorite Genre", "Date Requested"];
    const rows = submissions.map(sub => [
      sub.name,
      sub.email,
      sub.whatsapp,
      sub.favoriteGenre,
      sub.createdAt?.toDate ? sub.createdAt.toDate().toLocaleString() : ""
    ]);

    const xmlHeader = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Worksheet ss:Name="Requests">
  <Table>
   <Row>
    ${headers.map(h => `<Cell><Data ss:Type="String">${h}</Data></Cell>`).join("")}
   </Row>
   ${rows.map(row => `
   <Row>
    ${row.map(cell => `<Cell><Data ss:Type="String">${cell}</Data></Cell>`).join("")}
   </Row>`).join("")}
  </Table>
 </Worksheet>
</Workbook>`;

    const blob = new Blob([xmlHeader], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ITABC_Requests_${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel File Downloaded!");
  };

  if (isAuthLoading) return <div className="min-h-screen bg-parchment flex items-center justify-center font-serif font-bold text-2xl">Loading ITABC Admin...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-warm-sand flex items-center justify-center p-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-md bg-parchment p-10 rounded-[2.5rem] border-4 border-rich-charcoal shadow-[12px_12px_0px_#1A1A1A]"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-vibrant-lilac rounded-2xl border-4 border-rich-charcoal flex items-center justify-center mx-auto mb-4">
              <LockKey size={32} weight="fill" className="text-white" />
            </div>
            <h1 className="text-3xl font-serif font-black text-rich-charcoal">Admin Access</h1>
            <p className="text-rich-charcoal/60 mt-2">ITABC Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="text" 
              className="hidden" 
              value={honeypot} 
              onChange={e => setHoneypot(e.target.value)} 
              tabIndex={-1} 
              autoComplete="off" 
            />
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-rich-charcoal/40">Email</label>
              <input 
                name="email"
                type="email" required 
                autoComplete="email"
                className="w-full p-4 border-4 border-rich-charcoal rounded-xl bg-white focus:ring-4 focus:ring-vibrant-lilac outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-rich-charcoal/40">Password</label>
              <input 
                name="password"
                type="password" required 
                autoComplete="current-password"
                className="w-full p-4 border-4 border-rich-charcoal rounded-xl bg-white focus:ring-4 focus:ring-vibrant-lilac outline-none"
                style={{ WebkitTextSecurity: "disc" } as React.CSSProperties}
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full py-5 bg-vibrant-lilac text-white font-black text-xl rounded-xl border-4 border-rich-charcoal shadow-[6px_6px_0px_#1A1A1A] hover:shadow-[10px_10px_0px_#1A1A1A] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoggingIn ? <CircleNotch className="animate-spin" size={24} weight="bold" /> : "Login to ITABC"}
            </button>
          </form>
          <Link href="/" className="block text-center mt-8 font-bold text-rich-charcoal/40 hover:text-rich-charcoal">
            ← Back to Main Site
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment font-sans pb-20">
      <nav className="sticky top-0 z-50 bg-parchment border-b-4 border-rich-charcoal p-4 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rich-charcoal rounded-xl border-2 border-rich-charcoal shadow-[4px_4px_0px_#8C52FF] flex items-center justify-center">
              <img src="/logo.png" alt="ITABC" className="h-8 w-8 rounded-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-serif font-black text-rich-charcoal leading-none">Control Center</h1>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-vibrant-lilac">ITABC Admin Dashboard</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link href="/" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-rich-charcoal rounded-xl border-2 border-rich-charcoal shadow-[4px_4px_0px_#1A1A1A] font-black text-xs uppercase tracking-widest hover:translate-y-1 hover:shadow-none transition-all">
              <House weight="bold" size={18} /> View Site
            </Link>
            <button onClick={handleLogout} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-watermelon-pink text-white rounded-xl border-2 border-rich-charcoal shadow-[4px_4px_0px_#1A1A1A] font-black text-xs uppercase tracking-widest hover:translate-y-1 hover:shadow-none transition-all">
              <SignOut weight="bold" size={18} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Monthly Spotlight */}
            <section className="bg-white p-8 rounded-3xl border-4 border-rich-charcoal shadow-[8px_8px_0px_#1A1A1A]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-vibrant-lilac text-white rounded-xl">
                    <BookOpen size={24} weight="fill" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold">Monthly Spotlight</h2>
                    <p className="text-xs font-bold text-rich-charcoal/40 uppercase tracking-widest">Update the current read</p>
                  </div>
                </div>
                <button 
                  onClick={handleArchiveCurrent} 
                  disabled={loadingAction === "archiving"}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-rich-charcoal text-parchment rounded-xl border-2 border-rich-charcoal shadow-[4px_4px_0px_#F06595] font-black text-xs uppercase tracking-widest hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
                >
                  {loadingAction === "archiving" ? <CircleNotch className="animate-spin" /> : <Archive weight="bold" />} Archive Current Read
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-48 shrink-0">
                  <div className="aspect-[3/4.5] bg-parchment rounded-2xl border-4 border-rich-charcoal overflow-hidden shadow-[6px_6px_0px_#1A1A1A]">
                    {bookForm.cover ? <img src={bookForm.cover} alt="Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] font-black uppercase text-rich-charcoal/20">No Cover</div>}
                  </div>
                </div>
                <form onSubmit={handleUpdateCurrent} className="flex-1 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-rich-charcoal/40">Title</label>
                      <input value={bookForm.title} onChange={e => setBookForm({...bookForm, title: e.target.value})} className="w-full p-4 border-4 border-rich-charcoal rounded-xl bg-parchment font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-rich-charcoal/40">Author</label>
                      <input value={bookForm.author} onChange={e => setBookForm({...bookForm, author: e.target.value})} className="w-full p-4 border-4 border-rich-charcoal rounded-xl bg-parchment font-bold" />
                    </div>
                  </div>
                  <input value={bookForm.cover} onChange={e => setBookForm({...bookForm, cover: e.target.value})} className="w-full p-4 border-4 border-rich-charcoal rounded-xl bg-parchment font-medium text-xs" placeholder="Cover URL" />
                  <button type="submit" disabled={!!loadingAction} className="w-full bg-vibrant-lilac text-white font-black py-5 rounded-xl border-4 border-rich-charcoal shadow-[6px_6px_0px_#1A1A1A] uppercase text-sm disabled:opacity-50">
                    {loadingAction === "spotlight" ? <CircleNotch className="animate-spin" size={24} /> : "Update Spotlight"}
                  </button>
                </form>
              </div>
            </section>

            {/* Manual Archive Entry */}
            <section className="bg-white p-8 rounded-3xl border-4 border-rich-charcoal shadow-[8px_8px_0px_#1A1A1A]">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-forest-green text-white rounded-xl">
                  <Plus size={24} weight="bold" />
                </div>
                <h2 className="text-2xl font-serif font-bold">Manual Archive Entry</h2>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setLoadingAction("manualArchive");
                try {
                  await addPastBook({ ...pastBookForm, id: Math.random().toString() });
                  toast.success("Added!");
                  logActivity("MANUAL_ARCHIVE", `Manually added: ${pastBookForm.title}`);
                  setPastBookForm({ title: "", author: "", cover: "", summary: "", rating: 5, dateRead: "Feb 2026" });
                } catch (error: unknown) {
                  const e = error as Error;
                  toast.error(`Error: ${e.message}`);
                } finally {
                  setLoadingAction(null);
                }
              }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input placeholder="Title" value={pastBookForm.title} onChange={e => setPastBookForm({...pastBookForm, title: e.target.value})} className="p-4 border-4 border-rich-charcoal rounded-xl bg-parchment font-bold" />
                <input placeholder="Author" value={pastBookForm.author} onChange={e => setPastBookForm({...pastBookForm, author: e.target.value})} className="p-4 border-4 border-rich-charcoal rounded-xl bg-parchment font-bold" />
                <input placeholder="Cover URL" value={pastBookForm.cover} onChange={e => setPastBookForm({...pastBookForm, cover: e.target.value})} className="md:col-span-2 p-4 border-4 border-rich-charcoal rounded-xl bg-parchment" />
                <input placeholder="Month" value={pastBookForm.dateRead} onChange={e => setPastBookForm({...pastBookForm, dateRead: e.target.value})} className="p-4 border-4 border-rich-charcoal rounded-xl bg-parchment font-bold" />
                <input type="number" step="0.1" value={pastBookForm.rating} onChange={e => setPastBookForm({...pastBookForm, rating: parseFloat(e.target.value)})} className="p-4 border-4 border-rich-charcoal rounded-xl bg-parchment font-bold" />
                <textarea placeholder="Summary" value={pastBookForm.summary} onChange={e => setPastBookForm({...pastBookForm, summary: e.target.value})} className="md:col-span-2 p-4 border-4 border-rich-charcoal rounded-xl bg-parchment h-32" />
                <button type="submit" disabled={!!loadingAction} className="md:col-span-2 bg-forest-green text-white font-black p-4 rounded-xl border-4 border-rich-charcoal shadow-[4px_4px_0px_#1A1A1A] uppercase disabled:opacity-50">
                  {loadingAction === "manualArchive" ? <CircleNotch className="animate-spin" size={24} /> : "Add Past Book"}
                </button>
              </form>
            </section>

            {/* Manage Archive */}
            <section className="bg-white p-4 md:p-8 rounded-3xl border-4 border-rich-charcoal shadow-[8px_8px_0px_#1A1A1A]">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-vibrant-lilac text-white rounded-xl">
                  <Archive size={24} weight="fill" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-serif font-bold">Manage Archive</h2>
                  <p className="text-[10px] md:text-xs font-bold text-rich-charcoal/40 uppercase tracking-widest">Edit or remove past books</p>
                </div>
              </div>

              <div className="space-y-6">
                {pastBooks.length === 0 ? (
                  <div className="text-center py-12 border-4 border-dashed border-rich-charcoal/10 rounded-2xl text-rich-charcoal/40 font-bold">
                    No books in archive yet.
                  </div>
                ) : (
                  pastBooks.map((book) => (
                    <div key={book.id} className="group relative bg-parchment p-4 md:p-6 rounded-2xl border-4 border-rich-charcoal shadow-[4px_4px_0px_#1A1A1A] transition-all hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#1A1A1A]">
                      {editingBookId === book.id ? (
                        <form onSubmit={handleUpdatePastBook} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input 
                              placeholder="Title" 
                              value={editBookForm.title} 
                              onChange={e => setEditBookForm({...editBookForm, title: e.target.value})} 
                              className="p-3 border-2 border-rich-charcoal rounded-xl bg-white font-bold text-sm" 
                            />
                            <input 
                              placeholder="Author" 
                              value={editBookForm.author} 
                              onChange={e => setEditBookForm({...editBookForm, author: e.target.value})} 
                              className="p-3 border-2 border-rich-charcoal rounded-xl bg-white font-bold text-sm" 
                            />
                            <input 
                              placeholder="Cover URL" 
                              value={editBookForm.cover} 
                              onChange={e => setEditBookForm({...editBookForm, cover: e.target.value})} 
                              className="md:col-span-2 p-3 border-2 border-rich-charcoal rounded-xl bg-white text-xs" 
                            />
                            <input 
                              placeholder="Month" 
                              value={editBookForm.dateRead} 
                              onChange={e => setEditBookForm({...editBookForm, dateRead: e.target.value})} 
                              className="p-3 border-2 border-rich-charcoal rounded-xl bg-white font-bold text-sm" 
                            />
                            <input 
                              type="number" step="0.1" 
                              value={editBookForm.rating} 
                              onChange={e => setEditBookForm({...editBookForm, rating: parseFloat(e.target.value)})} 
                              className="p-3 border-2 border-rich-charcoal rounded-xl bg-white font-bold text-sm" 
                            />
                            <textarea 
                              placeholder="Summary" 
                              value={editBookForm.summary} 
                              onChange={e => setEditBookForm({...editBookForm, summary: e.target.value})} 
                              className="md:col-span-2 p-3 border-2 border-rich-charcoal rounded-xl bg-white h-24 text-sm" 
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <button 
                              type="submit" 
                              disabled={loadingAction === `update-past-${book.id}`}
                              className="flex-1 bg-forest-green text-white font-black p-3 rounded-xl border-2 border-rich-charcoal shadow-[2px_2px_0px_#1A1A1A] text-xs uppercase flex items-center justify-center gap-2"
                            >
                              {loadingAction === `update-past-${book.id}` ? <CircleNotch className="animate-spin" /> : <FloppyDisk weight="bold" />} Save Changes
                            </button>
                            <button 
                              type="button" 
                              onClick={handleCancelEdit}
                              className="flex-1 bg-white text-rich-charcoal font-black p-3 rounded-xl border-2 border-rich-charcoal shadow-[2px_2px_0px_#1A1A1A] text-xs uppercase"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-start">
                          <div className="w-20 sm:w-16 h-28 sm:h-24 shrink-0 bg-white rounded-lg border-2 border-rich-charcoal overflow-hidden shadow-[2px_2px_0px_#1A1A1A] self-center sm:self-start">
                            <img src={book.cover} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0 w-full">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                              <div className="min-w-0">
                                <h3 className="font-serif font-black text-lg text-rich-charcoal truncate">{book.title}</h3>
                                <p className="text-xs font-bold text-rich-charcoal/40 uppercase tracking-widest">{book.author}</p>
                              </div>
                              <div className="flex gap-2 w-full sm:w-auto">
                                <button 
                                  onClick={() => handleStartEdit(book)}
                                  className="flex-1 sm:flex-none p-2 bg-white text-rich-charcoal rounded-lg border-2 border-rich-charcoal shadow-[2px_2px_0px_#1A1A1A] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center"
                                >
                                  <PencilLine size={18} weight="bold" />
                                </button>
                                <button 
                                  onClick={() => handleDeletePastBook(book.id)}
                                  disabled={loadingAction === `delete-past-${book.id}`}
                                  className="flex-1 sm:flex-none p-2 bg-watermelon-pink text-white rounded-lg border-2 border-rich-charcoal shadow-[2px_2px_0px_#1A1A1A] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 flex items-center justify-center"
                                >
                                  {loadingAction === `delete-past-${book.id}` ? <CircleNotch className="animate-spin" size={18} /> : <Trash size={18} weight="bold" />}
                                </button>
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-2 md:gap-4">
                              <span className="inline-flex items-center gap-1 text-[9px] md:text-[10px] font-black text-vibrant-lilac uppercase bg-vibrant-lilac/10 px-2 py-0.5 rounded-full border border-vibrant-lilac/20">
                                <Calendar size={12} weight="bold" /> {book.dateRead}
                              </span>
                              <span className="text-[9px] md:text-[10px] font-black text-watermelon-pink uppercase bg-watermelon-pink/10 px-2 py-0.5 rounded-full border border-watermelon-pink/20">
                                ★ {book.rating}
                              </span>
                            </div>
                            <p className="mt-3 text-xs text-rich-charcoal/60 line-clamp-2 md:line-clamp-3 italic font-medium leading-relaxed">
                              {book.summary}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <div className="space-y-12">
            {/* Community Photo Section */}
            <section className="bg-white p-8 rounded-3xl border-4 border-rich-charcoal shadow-[8px_8px_0px_#1A1A1A]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-vibrant-lilac text-white rounded-xl">
                  <Camera size={20} weight="fill" />
                </div>
                <h2 className="text-xl font-serif font-bold">Community Photo</h2>
              </div>
              <form onSubmit={handleUpdateCommunityImage} className="space-y-4">
                <div className="aspect-video w-full bg-parchment rounded-xl border-4 border-rich-charcoal overflow-hidden mb-4 shadow-[4px_4px_0px_#1A1A1A]">
                  <img src={communityImageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <input 
                  value={communityImageUrl} 
                  onChange={e => setCommunityImageUrl(e.target.value)} 
                  className="w-full p-3 border-4 border-rich-charcoal rounded-xl bg-parchment font-medium text-xs" 
                  placeholder="Paste Image URL here..." 
                />
                <button 
                  type="submit" 
                  disabled={!!loadingAction}
                  className="w-full bg-vibrant-lilac text-white font-black p-3 rounded-xl border-4 border-rich-charcoal shadow-[4px_4px_0px_#1A1A1A] text-xs uppercase flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loadingAction === "community" ? <CircleNotch className="animate-spin" size={20} weight="bold" /> : "Update Vibe Photo"}
                </button>
              </form>
            </section>

            {/* Signature Wall Management */}
            <section className="bg-white p-8 rounded-3xl border-4 border-rich-charcoal shadow-[8px_8px_0px_#1A1A1A]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-watermelon-pink text-rich-charcoal rounded-xl">
                  <PencilLine size={20} weight="fill" />
                </div>
                <h2 className="text-xl font-serif font-bold">Signature Wall</h2>
              </div>
              <form onSubmit={handleUpdateSignatures} className="space-y-4">
                <p className="text-[10px] font-bold text-rich-charcoal/40 uppercase tracking-widest leading-relaxed">
                  Enter names separated by commas. These will appear blurred in the background of the &quot;Family&quot; section.
                </p>
                <textarea 
                  value={signatureText} 
                  onChange={e => setSignatureText(e.target.value)} 
                  className="w-full p-4 border-4 border-rich-charcoal rounded-xl bg-parchment font-bold text-sm h-32 focus:ring-4 focus:ring-watermelon-pink outline-none" 
                  placeholder="Tunde, Amaka, Chidi, Joel..." 
                />
                <button 
                  type="submit" 
                  disabled={!!loadingAction}
                  className="w-full bg-rich-charcoal text-parchment font-black p-3 rounded-xl border-4 border-rich-charcoal shadow-[4px_4px_0px_#F06595] text-xs uppercase flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loadingAction === "signatures" ? <CircleNotch className="animate-spin" size={20} weight="bold" /> : "Save Signatures"}
                </button>
              </form>
            </section>

            {/* Club Statistics */}
            <section className="bg-white p-8 rounded-3xl border-4 border-rich-charcoal shadow-[8px_8px_0px_#1A1A1A]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-forest-green text-white rounded-xl">
                  <TrendUp size={20} weight="fill" />
                </div>
                <h2 className="text-xl font-serif font-bold">Statistics</h2>
              </div>
              <form onSubmit={handleUpdateStats} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-rich-charcoal/40">Finished</label>
                    <input type="number" value={finishedCount} onChange={e => setFinishedCount(parseInt(e.target.value))} className="w-full p-3 border-4 border-rich-charcoal rounded-xl bg-parchment font-bold text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-rich-charcoal/40">Active</label>
                    <input type="number" value={membersCount} onChange={e => setMembersCount(parseInt(e.target.value))} className="w-full p-3 border-4 border-rich-charcoal rounded-xl bg-parchment font-bold text-sm" />
                  </div>
                </div>
                <button type="submit" disabled={!!loadingAction} className="w-full bg-forest-green text-white font-black p-3 rounded-xl border-4 border-rich-charcoal shadow-[4px_4px_0px_#1A1A1A] text-xs uppercase disabled:opacity-50">
                  {loadingAction === "stats" ? <CircleNotch className="animate-spin" size={20} /> : "Update Stats"}
                </button>
              </form>
            </section>

            {/* Badge & Timer */}
            <section className="bg-white p-8 rounded-3xl border-4 border-rich-charcoal shadow-[8px_8px_0px_#1A1A1A] space-y-8">
              <form onSubmit={handleUpdateBadge} className="space-y-4">
                <div className="flex items-center gap-2 mb-2 font-serif font-bold"><Plus size={18} /> Badge</div>
                <input value={currentBadge} onChange={e => setCurrentBadge(e.target.value)} className="w-full p-3 border-4 border-rich-charcoal rounded-xl bg-parchment font-bold text-sm" />
                <button type="submit" disabled={!!loadingAction} className="w-full bg-vibrant-lilac text-white font-black p-3 rounded-xl border-4 border-rich-charcoal shadow-[4px_4px_0px_#1A1A1A] text-xs uppercase disabled:opacity-50">
                  {loadingAction === "badge" ? <CircleNotch className="animate-spin" size={20} /> : "Update Badge"}
                </button>
              </form>
              <form onSubmit={handleUpdateTimer} className="space-y-4 border-t-4 border-dashed border-rich-charcoal/10 pt-8">
                <div className="flex items-center gap-2 mb-2 font-serif font-bold"><Calendar size={18} /> Timer</div>
                <input type="datetime-local" value={customMeetingDate} onChange={e => setCustomMeetingDate(e.target.value)} className="w-full p-3 border-4 border-rich-charcoal rounded-xl bg-parchment font-bold text-sm" />
                <button type="submit" disabled={!!loadingAction} className="w-full bg-watermelon-pink text-white font-black p-3 rounded-xl border-4 border-rich-charcoal shadow-[4px_4px_0px_#1A1A1A] text-xs uppercase disabled:opacity-50">
                  {loadingAction === "timer" ? <CircleNotch className="animate-spin" size={20} /> : "Update Timer"}
                </button>
              </form>
            </section>

            {/* Requests */}
            <section className="bg-parchment p-8 rounded-3xl border-4 border-rich-charcoal shadow-[8px_8px_0px_#1A1A1A] max-h-[500px] overflow-y-auto">
              <h2 className="text-xl font-serif font-bold text-rich-charcoal mb-6 flex items-center gap-2"><Users weight="fill" /> Requests ({submissions.length})</h2>
              <div className="space-y-4">
                {submissions.map((sub) => (
                  <div key={sub.id} className="bg-white p-4 rounded-xl border-2 border-rich-charcoal shadow-[4px_4px_0px_#1A1A1A] relative">
                    <button 
                      disabled={loadingAction === `delete-${sub.id}`}
                      onClick={async () => { if (window.confirm("Delete?")) { setLoadingAction(`delete-${sub.id}`); try { await deleteDoc(doc(db, "submissions", sub.id)); toast.success("Deleted"); logActivity("DELETE_REQUEST", sub.email); } catch (error: unknown) { const e = error as Error; toast.error(e.message); } finally { setLoadingAction(null); } } }} 
                      className="absolute top-2 right-2 text-rich-charcoal/20 hover:text-watermelon-pink"
                    >
                      {loadingAction === `delete-${sub.id}` ? <CircleNotch className="animate-spin" /> : "×"}
                    </button>
                    <h4 className="font-black text-xs uppercase">{sub.name}</h4>
                    <div className="flex flex-col gap-1 mt-1">
                      <a 
                        href={`https://wa.me/${sub.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`You received this message because you signified interest in joining *Is this a bookclub*. here is the link to join the official whatsapp group chat: https://chat.whatsapp.com/BwiA8PdWEdw8B7gX5LKaxp?mode=gi_t Welcome, and we do hope you enjoy your stay. -ITABC TEAM`)}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-black text-green-600 uppercase hover:underline"
                      >
                        <WhatsappLogo weight="fill" /> Invite to WhatsApp
                      </a>
                      <a 
                        href={`mailto:${sub.email}?subject=${encodeURIComponent("Welcome to Is This A Bookclub?")}&body=${encodeURIComponent(`Hi ${sub.name},\n\nYou received this message because you signified interest in joining Is This A Bookclub.\n\nHere is the link to join the official WhatsApp group chat: https://chat.whatsapp.com/BwiA8PdWEdw8B7gX5LKaxp?mode=gi_t\n\nWelcome, and we do hope you enjoy your stay.\n\n- ITABC TEAM`)}`}
                        className="inline-flex items-center gap-1 text-[10px] font-black text-watermelon-pink uppercase hover:underline"
                      >
                        <Envelope weight="fill" /> Invite to Email
                      </a>
                      <div className="text-[9px] font-bold text-rich-charcoal/40 truncate">{sub.email}</div>
                    </div>
                  </div>
                ))}
              </div>
              {submissions.length > 0 && (
                <button onClick={handleDownloadExcel} className="w-full mt-6 py-3 bg-rich-charcoal text-parchment rounded-xl border-2 border-rich-charcoal shadow-[4px_4px_0px_#8C52FF] font-black text-xs uppercase flex items-center justify-center gap-2">
                  <Download weight="bold" /> Download Excel
                </button>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
