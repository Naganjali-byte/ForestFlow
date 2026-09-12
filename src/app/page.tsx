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
  LogOut, 
  Volume2, 
  VolumeX,
  Trophy,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  progress: number; // 0 to 100%
  category: "Work" | "Personal" | "Health" | "Study";
  dueDate: string; // YYYY-MM-DD
}

interface UserProfile {
  name: string;
  email: string;
  treesPlanted: number;
  streak: number;
}

const AFFIRMATIONS = [
  { text: "Like a tree, stay grounded in patience while quietly reaching upward.", tag: "Patience" },
  { text: "Small daily habits compound into extraordinary lifelong growth.", tag: "Discipline" },
  { text: "Protect your energy. One calm, intentional task at a time.", tag: "Clarity" },
  { text: "Deep roots aren't built in a day; continuous progress creates your forest.", tag: "Resilience" }
];

const toDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "tasks" | "timer" | "profile">("home");
  const [quoteIdx, setQuoteIdx] = useState(0);

  const todayKey = toDateKey(new Date());

  // Calendar State for Tasks Tab
  const [selectedDate, setSelectedDate] = useState<string>(todayKey);
  const [calendarOffset, setCalendarOffset] = useState<number>(0);

  // Auth State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");

  // Tasks State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"Work" | "Personal" | "Health" | "Study">("Work");

  // Pomodoro State
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
        name: "anjali",
        email: "anjali@forestflow.app",
        treesPlanted: 6,
        streak: 3
      });
    }

    const savedTasks = localStorage.getItem("forestflow_tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks([
        { id: "1", title: "workout & posture training", completed: false, progress: 40, category: "Health", dueDate: todayKey },
        { id: "2", title: "read textbook chapter 4", completed: false, progress: 65, category: "Study", dueDate: todayKey },
        { id: "3", title: "build portfolio project", completed: false, progress: 20, category: "Work", dueDate: todayKey }
      ]);
    }
  }, [todayKey]);

  // Persist tasks
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("forestflow_tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // Persist user
  useEffect(() => {
    if (user) {
      localStorage.setItem("forestflow_user", JSON.stringify(user));
    }
  }, [user]);

  // Audio chime
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

  // Timer Tick
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

  // --- Task Operations ---
  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        return { ...t, completed: nextCompleted, progress: nextCompleted ? 100 : 0 };
      }
      return t;
    }));
  };

  const updateTaskProgress = (id: string, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextProg = Math.min(100, Math.max(0, t.progress + delta));
        return { ...t, progress: nextProg, completed: nextProg === 100 };
      }
      return t;
    }));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      progress: 0,
      category: newCategory,
      dueDate: selectedDate
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

  // Calendar Day strip calculations
  const getDaysArray = () => {
    const days = [];
    const base = new Date();
    base.setDate(base.getDate() + calendarOffset);
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const calendarDays = getDaysArray();

  // Tasks Filtered for Today vs Selected Day
  const todayTasks = tasks.filter(t => t.dueDate === todayKey);
  const tasksForSelectedDate = tasks.filter(t => t.dueDate === selectedDate);
  
  // Overall Today Progress (average of individual task progresses)
  const totalTodayProgress = todayTasks.length
    ? Math.round(todayTasks.reduce((sum, t) => sum + t.progress, 0) / todayTasks.length)
    : 0;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;
    setUser({
      name: authName || authEmail.split("@")[0],
      email: authEmail,
      treesPlanted: 6,
      streak: 3
    });
    setIsAuthModalOpen(false);
    setAuthEmail("");
    setAuthName("");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#E3ECE3", display: "flex", alignItems: "center", justifyContent: "center", padding: "0" }}>
      
      {/* Responsive App Container */}
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

          <button 
            onClick={() => setIsAuthModalOpen(true)}
            style={{ backgroundColor: "#E8F5E9", color: "#2D6A4F", border: "1px solid #C8E6C9", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}
          >
            <User size={13} />
            <span>{user ? user.name.split(" ")[0] : "Login"}</span>
          </button>
        </header>

        {/* MAIN SCROLLABLE AREA */}
        <main style={{ flex: 1, padding: "18px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* ================= TAB 1: HOME (TODAY'S TASKS & INDIVIDUAL PROGRESS ONLY) ================= */}
          {activeTab === "home" && (
            <>
              {/* Daily Affirmation Card */}
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

              {/* Today's Overall Progress Card */}
              <div style={{ backgroundColor: "#FFFFFF", padding: "16px", borderRadius: "20px", border: "1px solid #E1E9E1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div>
                    <span style={{ fontSize: "13px", fontWeight: "800", color: "#1B4332" }}>Today&apos;s Progress</span>
                    <span style={{ fontSize: "11px", color: "#778C7B", display: "block" }}>
                      {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <span style={{ fontSize: "18px", fontWeight: "900", color: "#2D6A4F" }}>{totalTodayProgress}%</span>
                </div>
                <div style={{ width: "100%", height: "10px", backgroundColor: "#EBF3EB", borderRadius: "8px", overflow: "hidden" }}>
                  <div style={{ width: `${totalTodayProgress}%`, height: "100%", backgroundColor: "#52B788", transition: "width 0.4s ease" }} />
                </div>
                <span style={{ fontSize: "11px", color: "#778C7B", marginTop: "8px", display: "block" }}>
                  {todayTasks.filter(t => t.completed).length} of {todayTasks.length} tasks completed today
                </span>
              </div>

              {/* Today's Tasks with Detailed Multi-Day Progress Bars */}
              <div style={{ backgroundColor: "#FFFFFF", padding: "16px", borderRadius: "20px", border: "1px solid #E1E9E1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "800", color: "#1B4332" }}>Today&apos;s Tasks & Progress</span>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#52B788", backgroundColor: "#EBF7EE", padding: "3px 8px", borderRadius: "10px" }}>
                    {todayTasks.length} Scheduled
                  </span>
                </div>

                {todayTasks.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "20px 0", color: "#8E9E8F", fontSize: "12px" }}>
                    No tasks for today. Switch to the Tasks tab to add one!
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {todayTasks.map((task) => (
                      <div 
                        key={task.id} 
                        style={{ padding: "12px 14px", borderRadius: "16px", backgroundColor: task.completed ? "#F5F8F5" : "#FAF9F6", border: "1px solid #E6ECE6", display: "flex", flexDirection: "column", gap: "10px" }}
                      >
                        {/* Task Title & Direct Checkbox */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div 
                            onClick={() => toggleTaskCompletion(task.id)}
                            style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", flex: 1 }}
                          >
                            {task.completed ? <CheckCircle2 size={19} color="#2D6A4F" /> : <Circle size={19} color="#ADC2AE" />}
                            <span style={{ fontSize: "13px", fontWeight: "700", textDecoration: task.completed ? "line-through" : "none", color: task.completed ? "#8E9E8F" : "#1B4332" }}>
                              {task.title}
                            </span>
                          </div>
                          <span style={{ fontSize: "12px", fontWeight: "800", color: task.completed ? "#2D6A4F" : "#556B58" }}>
                            {task.progress}%
                          </span>
                        </div>

                        {/* Individual Task Progress Bar */}
                        <div style={{ width: "100%", height: "6px", backgroundColor: "#EAEFEA", borderRadius: "6px", overflow: "hidden" }}>
                          <div style={{ width: `${task.progress}%`, height: "100%", backgroundColor: task.completed ? "#2D6A4F" : "#52B788", transition: "width 0.3s ease" }} />
                        </div>

                        {/* Multi-Day Progress Steppers */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "2px" }}>
                          <span style={{ fontSize: "10px", fontWeight: "700", color: "#8E9E8F", textTransform: "uppercase" }}>
                            {task.category}
                          </span>

                          <div style={{ display: "flex", gap: "6px" }}>
                            <button 
                              onClick={(e) => updateTaskProgress(task.id, -25, e)}
                              disabled={task.progress <= 0}
                              style={{ border: "1px solid #CCDBCD", backgroundColor: "#FFFFFF", color: "#556B58", padding: "2px 8px", borderRadius: "8px", fontSize: "10px", fontWeight: "800", cursor: "pointer", opacity: task.progress <= 0 ? 0.4 : 1 }}
                              title="Decrease progress by 25%"
                            >
                              -25%
                            </button>
                            <button 
                              onClick={(e) => updateTaskProgress(task.id, 25, e)}
                              disabled={task.progress >= 100}
                              style={{ border: "1px solid #A8D5B5", backgroundColor: "#EBF7EE", color: "#2D6A4F", padding: "2px 8px", borderRadius: "8px", fontSize: "10px", fontWeight: "800", cursor: "pointer", opacity: task.progress >= 100 ? 0.4 : 1 }}
                              title="Increase progress by 25%"
                            >
                              +25%
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ================= TAB 2: TASKS (FULL CALENDAR DATE STRIP) ================= */}
          {activeTab === "tasks" && (
            <>
              {/* Interactive Calendar Date Strip */}
              <div style={{ backgroundColor: "#FFFFFF", padding: "14px", borderRadius: "20px", border: "1px solid #E1E9E1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <CalendarIcon size={16} color="#2D6A4F" />
                    <span style={{ fontSize: "13px", fontWeight: "800", color: "#1B4332" }}>
                      {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <button 
                      onClick={() => setCalendarOffset(calendarOffset - 7)} 
                      style={{ border: "none", background: "#F1F5F1", borderRadius: "8px", padding: "4px", cursor: "pointer" }}
                    >
                      <ChevronLeft size={16} color="#2D6A4F" />
                    </button>
                    <button 
                      onClick={() => { setCalendarOffset(0); setSelectedDate(todayKey); }}
                      style={{ border: "1px solid #CCDBCD", background: "none", borderRadius: "8px", padding: "3px 8px", fontSize: "10px", fontWeight: "800", color: "#2D6A4F", cursor: "pointer" }}
                    >
                      Today
                    </button>
                    <button 
                      onClick={() => setCalendarOffset(calendarOffset + 7)} 
                      style={{ border: "none", background: "#F1F5F1", borderRadius: "8px", padding: "4px", cursor: "pointer" }}
                    >
                      <ChevronRight size={16} color="#2D6A4F" />
                    </button>
                  </div>
                </div>

                {/* 7-Day Horizontal Strip */}
                <div style={{ display: "flex", justifyContent: "space-between", gap: "4px" }}>
                  {calendarDays.map((dateObj) => {
                    const dKey = toDateKey(dateObj);
                    const isSelected = selectedDate === dKey;
                    const isToday = todayKey === dKey;
                    const dayTasksCount = tasks.filter(t => t.dueDate === dKey && !t.completed).length;

                    return (
                      <button
                        key={dKey}
                        onClick={() => setSelectedDate(dKey)}
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          padding: "8px 4px",
                          borderRadius: "14px",
                          border: isSelected ? "2px solid #2D6A4F" : "1px solid transparent",
                          backgroundColor: isSelected ? "#2D6A4F" : isToday ? "#EBF7EE" : "#FAF9F6",
                          color: isSelected ? "#FFFFFF" : isToday ? "#2D6A4F" : "#556B58",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase" }}>
                          {dateObj.toLocaleDateString("en-US", { weekday: "narrow" })}
                        </span>
                        <span style={{ fontSize: "14px", fontWeight: "900", marginTop: "2px" }}>
                          {dateObj.getDate()}
                        </span>
                        {dayTasksCount > 0 && (
                          <div style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: isSelected ? "#FFFFFF" : "#52B788", marginTop: "4px" }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add Task Input for Selected Date */}
              <form onSubmit={addTask} style={{ backgroundColor: "#FFFFFF", padding: "14px", borderRadius: "18px", border: "1px solid #E1E9E1", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input 
                    type="text" 
                    placeholder={`Add task for ${new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}...`}
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
                    {(["Work", "Personal", "Health", "Study"] as const).map((cat) => (
                      <button 
                        key={cat}
                        type="button"
                        onClick={() => setNewCategory(cat)}
                        style={{ border: "1px solid #CCDBCD", backgroundColor: newCategory === cat ? "#2D6A4F" : "#FFFFFF", color: newCategory === cat ? "#FFFFFF" : "#556B58", padding: "4px 8px", borderRadius: "8px", fontSize: "10px", fontWeight: "700", cursor: "pointer" }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <input 
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{ border: "1px solid #CCDBCD", borderRadius: "8px", padding: "3px 6px", fontSize: "10px", color: "#2D6A4F", fontWeight: "700", outline: "none", cursor: "pointer" }}
                  />
                </div>
              </form>

              {/* Tasks for the Selected Calendar Day */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "800", color: "#1B4332" }}>
                    Tasks for {selectedDate === todayKey ? "Today" : new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#778C7B" }}>
                    {tasksForSelectedDate.filter(t => !t.completed).length} pending
                  </span>
                </div>

                {tasksForSelectedDate.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "24px 0", color: "#8E9E8F", fontSize: "12px", backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E1EAE1" }}>
                    No tasks scheduled for this day. Plan something above!
                  </div>
                ) : (
                  tasksForSelectedDate.map((task) => (
                    <div 
                      key={task.id} 
                      onClick={() => toggleTaskCompletion(task.id)}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: "16px", backgroundColor: task.completed ? "#F3F7F3" : "#FFFFFF", border: "1px solid #E1EAE1", cursor: "pointer" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {task.completed ? <CheckCircle2 size={18} color="#2D6A4F" /> : <Circle size={18} color="#ADC2AE" />}
                        <div>
                          <span style={{ fontSize: "13px", fontWeight: "700", textDecoration: task.completed ? "line-through" : "none", color: task.completed ? "#8E9E8F" : "#1B4332", display: "block" }}>
                            {task.title}
                          </span>
                          <span style={{ fontSize: "10px", color: "#8E9E8F" }}>{task.category} • Progress: {task.progress}%</span>
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

          {/* ================= TAB 3: FOCUS CLOCK (POMODORO) ================= */}
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

          {/* ================= TAB 4: GARDEN & PROFILE ================= */}
          {activeTab === "profile" && (
            <>
              {/* User Header */}
              <div style={{ backgroundColor: "#FFFFFF", padding: "16px", borderRadius: "20px", border: "1px solid #E1EAE1", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "16px", backgroundColor: "#2D6A4F", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "18px" }}>
                    {user?.name.charAt(0).toUpperCase() || "A"}
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

              {/* Growing Forest */}
              <div style={{ backgroundColor: "#F7F5EE", padding: "18px", borderRadius: "22px", border: "1px solid #E5DFD1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "800", color: "#2D6A4F", textTransform: "uppercase" }}>
                    🌱 Growing Forest
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#778C7B" }}>
                    Streak level: {user ? Math.floor(user.streak / 2) + 1 : 1}
                  </span>
                </div>
                
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