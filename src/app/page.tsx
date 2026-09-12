"use client";

import React, { useState, useEffect } from "react";
import { 
  TreePine, 
  Home as HomeIcon, 
  CheckSquare, 
  Timer, 
  User, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Flame, 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowRight, 
  LogOut, 
  Volume2, 
  VolumeX,
  Trophy,
  ChevronRight
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: "Work" | "Personal" | "Health" | "Study";
  dueDate: "today" | "tomorrow" | "upcoming";
  time?: string;
}

interface UserProfile {
  name: string;
  email: string;
  treesPlanted: number;
  streak: number;
}

const AFFIRMATIONS = [
  { text: "Like a tree, stay grounded in patience while reaching upward.", tag: "Patience" },
  { text: "Small daily habits compound into extraordinary lifelong growth.", tag: "Discipline" },
  { text: "Protect your energy. One calm, intentional task at a time.", tag: "Clarity" },
  { text: "Deep roots aren't built in a day; consistency creates your forest.", tag: "Resilience" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "tasks" | "timer" | "profile">("home");
  const [quoteIdx, setQuoteIdx] = useState(0);

  // --- Auth State ---
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");

  // --- Task Schedule Filter ---
  const [taskView, setTaskView] = useState<"today" | "tomorrow" | "upcoming">("today");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"Work" | "Personal" | "Health" | "Study">("Work");
  const [newTaskDate, setNewTaskDate] = useState<"today" | "tomorrow" | "upcoming">("today");

  // --- Pomodoro State ---
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Load saved state
  useEffect(() => {
    const savedUser = localStorage.getItem("forestflow_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser({
        name: "Forest Keeper",
        email: "keeper@forestflow.app",
        treesPlanted: 6,
        streak: 3
      });
    }

    const savedTasks = localStorage.getItem("forestflow_tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks([
        { id: "1", title: "Complete design mockups", completed: true, category: "Work", dueDate: "today", time: "09:30 AM" },
        { id: "2", title: "Review tomorrow's priorities", completed: false, category: "Personal", dueDate: "today", time: "05:00 PM" },
        { id: "3", title: "Prepare weekly status report", completed: false, category: "Work", dueDate: "tomorrow", time: "10:00 AM" },
        { id: "4", title: "Read 30 pages of textbook", completed: false, category: "Study", dueDate: "upcoming", time: "Weekend" }
      ]);
    }
  }, []);

  // Sync tasks
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("forestflow_tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // Sync user
  useEffect(() => {
    if (user) {
      localStorage.setItem("forestflow_user", JSON.stringify(user));
    }
  }, [user]);

  // Beep Audio chime using Web Audio API
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {}
  };

  // Pomodoro countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      playChime();
      setIsRunning(false);
      if (mode === "focus") {
        if (user) {
          setUser({
            ...user,
            treesPlanted: user.treesPlanted + 1,
            streak: user.streak + 1
          });
        }
        setMode("break");
        setTimeLeft(5 * 60);
      } else {
        setMode("focus");
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, soundEnabled, user]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === "focus" ? 25 * 60 : 5 * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Task Handlers
  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      category: newCategory,
      dueDate: newTaskDate,
      time: newTaskDate === "today" ? "Today" : newTaskDate === "tomorrow" ? "Tomorrow" : "Upcoming"
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = tasks.filter(t => t.id !== id);
    setTasks(filtered);
    localStorage.setItem("forestflow_tasks", JSON.stringify(filtered));
  };

  // Filter tasks
  const todayTasks = tasks.filter(t => t.dueDate === "today");
  const tomorrowTasks = tasks.filter(t => t.dueDate === "tomorrow");
  const upcomingTasks = tasks.filter(t => t.dueDate === "upcoming");

  const displayedTasks = taskView === "today" 
    ? todayTasks 
    : taskView === "tomorrow" 
    ? tomorrowTasks 
    : upcomingTasks;

  const todayCompleted = todayTasks.filter(t => t.completed).length;
  const progressPercent = todayTasks.length ? Math.round((todayCompleted / todayTasks.length) * 100) : 0;

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;
    setUser({
      name: authName || authEmail.split("@")[0],
      email: authEmail,
      treesPlanted: 5,
      streak: 2
    });
    setIsAuthModalOpen(false);
    setAuthEmail("");
    setAuthName("");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#E3ECE3", display: "flex", alignItems: "center", justifyContent: "center", padding: "0" }}>
      
      {/* Container that is responsive: full-screen on mobile, centered card on desktop */}
      <div style={{ width: "100%", maxWidth: "430px", height: "100vh", maxHeight: "880px", backgroundColor: "#FAF9F5", borderRadius: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 20px 45px rgba(0,0,0,0.12)", border: "2px solid #D2DDD2", overflow: "hidden", position: "relative" }}>
        
        {/* TOP HEADER */}
        <header style={{ padding: "16px 20px", borderBottom: "1px solid #E2EAE2", backgroundColor: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ backgroundColor: "#2D6A4F", color: "white", padding: "8px", borderRadius: "14px", display: "flex" }}>
              <TreePine size={22} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#1B4332", lineHeight: "1.2" }}>ForestFlow</h1>
              <span style={{ fontSize: "11px", color: "#52B788", fontWeight: "700" }}>Focus & Grow</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              style={{ backgroundColor: "#E8F5E9", color: "#2D6A4F", border: "1px solid #C8E6C9", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}
            >
              <User size={13} />
              <span>{user ? user.name.split(" ")[0] : "Login"}</span>
            </button>
          </div>
        </header>

        {/* MAIN SCROLLABLE CONTENT */}
        <main style={{ flex: 1, padding: "18px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* ================= TAB 1: HOME (TODAY'S FOCUS) ================= */}
          {activeTab === "home" && (
            <>
              {/* Daily Affirmation */}
              <div style={{ background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)", padding: "18px", borderRadius: "24px", color: "#FFFFFF", boxShadow: "0 10px 20px rgba(27,67,50,0.15)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "10px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", backgroundColor: "rgba(255,255,255,0.2)", padding: "3px 10px", borderRadius: "10px" }}>
                    Daily Affirmation
                  </span>
                  <button onClick={() => setQuoteIdx((quoteIdx + 1) % AFFIRMATIONS.length)} style={{ background: "none", border: "none", color: "#A7D7C5", cursor: "pointer", fontSize: "11px", fontWeight: "700" }}>
                    Next ↻
                  </button>
                </div>
                <p style={{ margin: "12px 0 0", fontSize: "14px", fontStyle: "italic", lineHeight: "1.5" }}>
                  "{AFFIRMATIONS[quoteIdx].text}"
                </p>
                <div style={{ marginTop: "12px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.2)", fontSize: "11px", color: "#D8F3DC", display: "flex", justifyContent: "space-between" }}>
                  <span>Mindset: {AFFIRMATIONS[quoteIdx].tag}</span>
                  <span>🌱 Calm & Steady</span>
                </div>
              </div>

              {/* Today's Progress Bar */}
              <div style={{ backgroundColor: "#FFFFFF", padding: "16px", borderRadius: "20px", border: "1px solid #E1E9E1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "800", color: "#1B4332" }}>Today&apos;s Progress</span>
                  <span style={{ fontSize: "15px", fontWeight: "900", color: "#2D6A4F" }}>{progressPercent}%</span>
                </div>
                <div style={{ width: "100%", height: "10px", backgroundColor: "#EBF3EB", borderRadius: "8px", overflow: "hidden" }}>
                  <div style={{ width: `${progressPercent}%`, height: "100%", backgroundColor: "#52B788", transition: "width 0.4s ease" }} />
                </div>
                <span style={{ fontSize: "11px", color: "#778C7B", marginTop: "8px", display: "block" }}>
                  {todayCompleted} of {todayTasks.length} tasks completed today
                </span>
              </div>

              {/* Present / Today's Active Tasks */}
              <div style={{ backgroundColor: "#FFFFFF", padding: "16px", borderRadius: "20px", border: "1px solid #E1E9E1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "800", color: "#1B4332" }}>Today&apos;s Active Tasks</span>
                  <button onClick={() => setActiveTab("tasks")} style={{ background: "none", border: "none", color: "#2D6A4F", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>
                    View All &rarr;
                  </button>
                </div>
                
                {todayTasks.length === 0 ? (
                  <p style={{ fontSize: "12px", color: "#8E9E8F", margin: 0, textAlign: "center", padding: "8px 0" }}>
                    No tasks scheduled for today. Add one in Tasks!
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {todayTasks.slice(0, 3).map((task) => (
                      <div 
                        key={task.id} 
                        onClick={() => toggleTask(task.id)}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "14px", backgroundColor: task.completed ? "#F5F8F5" : "#FAF9F6", border: "1px solid #EAEFEA", cursor: "pointer" }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          {task.completed ? <CheckCircle2 size={18} color="#2D6A4F" /> : <Circle size={18} color="#ADC2AE" />}
                          <span style={{ fontSize: "13px", fontWeight: "700", textDecoration: task.completed ? "line-through" : "none", color: task.completed ? "#8E9E8F" : "#1B4332" }}>
                            {task.title}
                          </span>
                        </div>
                        <span style={{ fontSize: "10px", fontWeight: "700", color: "#2D6A4F", backgroundColor: "#E8F5E9", padding: "2px 8px", borderRadius: "8px" }}>
                          {task.time || "Today"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Fast Jump to Clock */}
              <div onClick={() => setActiveTab("timer")} style={{ backgroundColor: "#EBF7EE", border: "1px solid #C5E8CE", padding: "14px 16px", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: "800", color: "#2D6A4F", textTransform: "uppercase" }}>Focus Clock</div>
                  <div style={{ fontSize: "13px", fontWeight: "800", color: "#1B4332" }}>25-Min Nature Sprint</div>
                </div>
                <div style={{ backgroundColor: "#2D6A4F", color: "white", padding: "6px 12px", borderRadius: "12px", fontSize: "11px", fontWeight: "700" }}>
                  Start
                </div>
              </div>
            </>
          )}

          {/* ================= TAB 2: TASKS (TODAY, TOMORROW, UPCOMING) ================= */}
          {activeTab === "tasks" && (
            <>
              {/* Day Filter Tabs */}
              <div style={{ display: "flex", backgroundColor: "#EBF2EB", padding: "4px", borderRadius: "16px", gap: "4px" }}>
                <button 
                  onClick={() => setTaskView("today")}
                  style={{ flex: 1, border: "none", padding: "8px", borderRadius: "12px", fontSize: "12px", fontWeight: "800", cursor: "pointer", backgroundColor: taskView === "today" ? "#2D6A4F" : "transparent", color: taskView === "today" ? "#FFFFFF" : "#2D6A4F" }}
                >
                  Today ({todayTasks.length})
                </button>
                <button 
                  onClick={() => setTaskView("tomorrow")}
                  style={{ flex: 1, border: "none", padding: "8px", borderRadius: "12px", fontSize: "12px", fontWeight: "800", cursor: "pointer", backgroundColor: taskView === "tomorrow" ? "#2D6A4F" : "transparent", color: taskView === "tomorrow" ? "#FFFFFF" : "#2D6A4F" }}
                >
                  Tomorrow ({tomorrowTasks.length})
                </button>
                <button 
                  onClick={() => setTaskView("upcoming")}
                  style={{ flex: 1, border: "none", padding: "8px", borderRadius: "12px", fontSize: "12px", fontWeight: "800", cursor: "pointer", backgroundColor: taskView === "upcoming" ? "#2D6A4F" : "transparent", color: taskView === "upcoming" ? "#FFFFFF" : "#2D6A4F" }}
                >
                  Upcoming ({upcomingTasks.length})
                </button>
              </div>

              {/* Add Task Input */}
              <form onSubmit={addTask} style={{ backgroundColor: "#FFFFFF", padding: "14px", borderRadius: "18px", border: "1px solid #E1E9E1", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input 
                    type="text" 
                    placeholder={`Add task for ${taskView}...`}
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    style={{ flex: 1, padding: "10px 12px", borderRadius: "12px", border: "1px solid #CCDBCD", fontSize: "13px", outline: "none" }}
                  />
                  <button type="submit" style={{ backgroundColor: "#2D6A4F", color: "white", border: "none", padding: "0 16px", borderRadius: "12px", cursor: "pointer", fontWeight: "700" }}>
                    <Plus size={18} />
                  </button>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {(["today", "tomorrow", "upcoming"] as const).map((d) => (
                      <button 
                        key={d}
                        type="button"
                        onClick={() => setNewTaskDate(d)}
                        style={{ border: "1px solid #CCDBCD", backgroundColor: newTaskDate === d ? "#2D6A4F" : "#FFFFFF", color: newTaskDate === d ? "#FFFFFF" : "#556B58", padding: "4px 8px", borderRadius: "8px", fontSize: "10px", fontWeight: "700", cursor: "pointer", textTransform: "capitalize" }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: "4px" }}>
                    {(["Work", "Study", "Health"] as const).map((cat) => (
                      <button 
                        key={cat}
                        type="button"
                        onClick={() => setNewCategory(cat as any)}
                        style={{ border: "1px solid #CCDBCD", backgroundColor: newCategory === cat ? "#E8F5E9" : "#FFFFFF", color: "#2D6A4F", padding: "4px 8px", borderRadius: "8px", fontSize: "10px", fontWeight: "700", cursor: "pointer" }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </form>

              {/* Task List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {displayedTasks.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "30px 0", color: "#8E9E8F", fontSize: "12px" }}>
                    No tasks found for {taskView}. Click above to add!
                  </div>
                ) : (
                  displayedTasks.map((task) => (
                    <div 
                      key={task.id} 
                      onClick={() => toggleTask(task.id)}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: "16px", backgroundColor: task.completed ? "#F3F7F3" : "#FFFFFF", border: "1px solid #E1EAE1", cursor: "pointer" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {task.completed ? <CheckCircle2 size={18} color="#2D6A4F" /> : <Circle size={18} color="#ADC2AE" />}
                        <div>
                          <span style={{ fontSize: "13px", fontWeight: "700", textDecoration: task.completed ? "line-through" : "none", color: task.completed ? "#8E9E8F" : "#1B4332", display: "block" }}>
                            {task.title}
                          </span>
                          <span style={{ fontSize: "10px", color: "#8E9E8F" }}>{task.category} • {task.time || task.dueDate}</span>
                        </div>
                      </div>
                      <button onClick={(e) => deleteTask(task.id, e)} style={{ background: "none", border: "none", color: "#C48888", cursor: "pointer" }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* ================= TAB 3: FOCUS CLOCK ================= */}
          {activeTab === "timer" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "20px" }}>
              <div style={{ display: "flex", gap: "8px", backgroundColor: "#E8F0E8", padding: "4px", borderRadius: "16px" }}>
                <button 
                  onClick={() => { setMode("focus"); setTimeLeft(25 * 60); setIsRunning(false); }}
                  style={{ border: "none", padding: "8px 18px", borderRadius: "12px", fontSize: "12px", fontWeight: "700", cursor: "pointer", backgroundColor: mode === "focus" ? "#2D6A4F" : "transparent", color: mode === "focus" ? "#FFFFFF" : "#2D6A4F" }}
                >
                  🌱 25m Focus
                </button>
                <button 
                  onClick={() => { setMode("break"); setTimeLeft(5 * 60); setIsRunning(false); }}
                  style={{ border: "none", padding: "8px 18px", borderRadius: "12px", fontSize: "12px", fontWeight: "700", cursor: "pointer", backgroundColor: mode === "break" ? "#2D6A4F" : "transparent", color: mode === "break" ? "#FFFFFF" : "#2D6A4F" }}
                >
                  🍃 5m Break
                </button>
              </div>

              {/* Big Dial */}
              <div style={{ width: "230px", height: "230px", borderRadius: "50%", border: "10px solid #D8E8D9", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 4px 10px rgba(0,0,0,0.05)" }}>
                <span style={{ fontSize: "46px", fontWeight: "900", fontFamily: "monospace", color: "#1B4332" }}>
                  {formatTime(timeLeft)}
                </span>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#52B788", textTransform: "uppercase", letterSpacing: "1px", marginTop: "6px" }}>
                  {isRunning ? "Focusing..." : "Ready"}
                </span>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button 
                  onClick={toggleTimer} 
                  style={{ backgroundColor: "#2D6A4F", color: "white", border: "none", padding: "12px 26px", borderRadius: "16px", fontSize: "14px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 6px 16px rgba(45,106,79,0.3)" }}
                >
                  {isRunning ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start Focus</>}
                </button>
                <button 
                  onClick={resetTimer} 
                  style={{ backgroundColor: "#FFFFFF", border: "1px solid #D5E2D5", color: "#556B58", padding: "12px", borderRadius: "16px", cursor: "pointer" }}
                >
                  <RotateCcw size={16} />
                </button>
                <button 
                  onClick={() => setSoundEnabled(!soundEnabled)} 
                  style={{ backgroundColor: "#FFFFFF", border: "1px solid #D5E2D5", color: soundEnabled ? "#2D6A4F" : "#A6B8A8", padding: "12px", borderRadius: "16px", cursor: "pointer" }}
                >
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
              </div>
            </div>
          )}

          {/* ================= TAB 4: GARDEN & STREAK DASHBOARD ================= */}
          {activeTab === "profile" && (
            <>
              {/* User Header */}
              <div style={{ backgroundColor: "#FFFFFF", padding: "16px", borderRadius: "20px", border: "1px solid #E1EAE1", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "16px", backgroundColor: "#2D6A4F", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "18px" }}>
                    {user?.name.charAt(0).toUpperCase() || "F"}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#1B4332" }}>{user?.name || "Forest Keeper"}</h3>
                    <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#52B788", fontWeight: "700" }}>{user?.email || "Local Gardener"}</p>
                  </div>
                </div>
                {user && (
                  <button onClick={() => { localStorage.removeItem("forestflow_user"); setUser(null); }} style={{ background: "none", border: "none", color: "#A6B8A8", cursor: "pointer" }}>
                    <LogOut size={18} />
                  </button>
                )}
              </div>

              {/* Streaks & Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={{ backgroundColor: "#FFFFFF", padding: "16px", borderRadius: "18px", border: "1px solid #E1EAE1", textAlign: "center" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "4px", color: "#E07A5F" }}>
                    <Flame size={20} />
                  </div>
                  <span style={{ fontSize: "24px", fontWeight: "900", color: "#1B4332", display: "block" }}>
                    {user?.streak || 0} Days
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#778C7B" }}>Active Streak</span>
                </div>

                <div style={{ backgroundColor: "#FFFFFF", padding: "16px", borderRadius: "18px", border: "1px solid #E1EAE1", textAlign: "center" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "4px", color: "#2D6A4F" }}>
                    <Trophy size={20} />
                  </div>
                  <span style={{ fontSize: "24px", fontWeight: "900", color: "#1B4332", display: "block" }}>
                    {user?.treesPlanted || 0}
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#778C7B" }}>Trees Planted</span>
                </div>
              </div>

              {/* Virtual Growing Garden */}
              <div style={{ backgroundColor: "#F7F5EE", padding: "18px", borderRadius: "22px", border: "1px solid #E5DFD1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "800", color: "#2D6A4F", textTransform: "uppercase" }}>
                    🌱 Growing Forest
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#778C7B" }}>
                    Streak level: {user ? Math.floor(user.streak / 2) + 1 : 1}
                  </span>
                </div>
                
                {/* Dynamically growing trees according to treesPlanted & streak */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", fontSize: "28px", padding: "10px 0" }}>
                  {Array.from({ length: Math.max(user?.treesPlanted || 4, 1) }).map((_, idx) => (
                    <span key={idx} title={`Tree #${idx + 1}`}>
                      {idx % 3 === 0 ? "🌲" : idx % 3 === 1 ? "🌳" : "🌱"}
                    </span>
                  ))}
                </div>

                <p style={{ fontSize: "11px", color: "#6C7D70", margin: "6px 0 0", lineHeight: "1.4" }}>
                  Every completed 25-min focus session grows a new pine or oak in your forest!
                </p>
              </div>
            </>
          )}

        </main>

        {/* 4 BOTTOM NAVIGATION TABS */}
        <nav style={{ borderTop: "1px solid #E2EAE2", backgroundColor: "#FFFFFF", padding: "12px 20px", display: "flex", justifyContent: "space-around" }}>
          <button 
            type="button" 
            onClick={() => setActiveTab("home")} 
            style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer", color: activeTab === "home" ? "#2D6A4F" : "#A6B8A8", fontWeight: "800", fontSize: "11px" }}
          >
            <HomeIcon size={20} />
            <span>Home</span>
          </button>

          <button 
            type="button" 
            onClick={() => setActiveTab("tasks")} 
            style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer", color: activeTab === "tasks" ? "#2D6A4F" : "#A6B8A8", fontWeight: "800", fontSize: "11px" }}
          >
            <CheckSquare size={20} />
            <span>Tasks</span>
          </button>

          <button 
            type="button" 
            onClick={() => setActiveTab("timer")} 
            style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer", color: activeTab === "timer" ? "#2D6A4F" : "#A6B8A8", fontWeight: "800", fontSize: "11px" }}
          >
            <Timer size={20} />
            <span>Clock</span>
          </button>

          <button 
            type="button" 
            onClick={() => setActiveTab("profile")} 
            style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer", color: activeTab === "profile" ? "#2D6A4F" : "#A6B8A8", fontWeight: "800", fontSize: "11px" }}
          >
            <User size={20} />
            <span>Garden</span>
          </button>
        </nav>

        {/* LOGIN MODAL */}
        {isAuthModalOpen && (
          <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", zIndex: 100 }}>
            <div style={{ backgroundColor: "#FFFFFF", width: "100%", maxWidth: "300px", borderRadius: "24px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <TreePine size={22} color="#2D6A4F" />
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#1B4332" }}>Sign In</h3>
              </div>
              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  value={authName} 
                  onChange={(e) => setAuthName(e.target.value)} 
                  style={{ padding: "10px", borderRadius: "10px", border: "1px solid #CCDBCD", fontSize: "12px", outline: "none" }}
                />
                <input 
                  type="email" 
                  required 
                  placeholder="name@example.com" 
                  value={authEmail} 
                  onChange={(e) => setAuthEmail(e.target.value)} 
                  style={{ padding: "10px", borderRadius: "10px", border: "1px solid #CCDBCD", fontSize: "12px", outline: "none" }}
                />
                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <button type="submit" style={{ flex: 1, backgroundColor: "#2D6A4F", color: "white", border: "none", padding: "10px", borderRadius: "12px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}>
                    Save
                  </button>
                  <button type="button" onClick={() => setIsAuthModalOpen(false)} style={{ backgroundColor: "#F0F0F0", border: "none", padding: "10px", borderRadius: "12px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}