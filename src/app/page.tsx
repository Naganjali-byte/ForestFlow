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
  Calendar,
  Clock
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  time: string;
}

const AFFIRMATIONS = [
  { text: "Like a tree, stay grounded in patience while reaching upward.", tag: "Patience" },
  { text: "Small daily habits compound into extraordinary lifelong growth.", tag: "Discipline" },
  { text: "Protect your energy and take one calm step at a time.", tag: "Clarity" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "tasks" | "timer" | "profile">("home");
  const [quoteIdx, setQuoteIdx] = useState(0);

  // Tasks State
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Complete design mockups", completed: true, category: "Work", time: "09:30 AM" },
    { id: "2", title: "Read 20 pages of book", completed: false, category: "Study", time: "11:00 AM" },
    { id: "3", title: "30-minute nature walk", completed: false, category: "Health", time: "04:30 PM" }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Work");

  // Pomodoro State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (mode === "focus") {
        setMode("break");
        setTimeLeft(5 * 60);
      } else {
        setMode("focus");
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

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

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([
      ...tasks, 
      { id: Date.now().toString(), title: newTaskTitle, completed: false, category: newCategory, time: "Today" }
    ]);
    setNewTaskTitle("");
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#E6ECE6", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      
      {/* App Container */}
      <div style={{ width: "100%", maxWidth: "420px", height: "820px", backgroundColor: "#FAF9F5", borderRadius: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 20px 40px rgba(0,0,0,0.12)", border: "2px solid #D5DFD5", overflow: "hidden" }}>
        
        {/* Top Header */}
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #E2EAE2", backgroundColor: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
            <div style={{ backgroundColor: "#2D6A4F", color: "white", padding: "10px", borderRadius: "14px", display: "flex" }}>
              <TreePine size={22} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#1B4332", lineHeight: "1.2" }}>ForestFlow</h1>
              <span style={{ fontSize: "11px", color: "#52B788", fontWeight: "700" }}>🌿 Focus & Breathe</span>
            </div>
          </div>
          <div style={{ backgroundColor: "#E8F5E9", color: "#2D6A4F", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
            <Calendar size={13} />
            <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* TAB 1: HOME */}
          {activeTab === "home" && (
            <>
              {/* Daily Affirmation */}
              <div style={{ background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)", padding: "20px", borderRadius: "24px", color: "#FFFFFF" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "10px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", backgroundColor: "rgba(255,255,255,0.2)", padding: "4px 10px", borderRadius: "12px" }}>
                    Daily Affirmation
                  </span>
                  <button onClick={() => setQuoteIdx((quoteIdx + 1) % AFFIRMATIONS.length)} style={{ background: "none", border: "none", color: "#A7D7C5", cursor: "pointer", fontSize: "11px", fontWeight: "700" }}>
                    Next ↻
                  </button>
                </div>
                <p style={{ margin: "14px 0 0", fontSize: "15px", fontStyle: "italic", lineHeight: "1.5" }}>
                  "{AFFIRMATIONS[quoteIdx].text}"
                </p>
                <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.2)", fontSize: "11px", color: "#D8F3DC", display: "flex", justifyContent: "space-between" }}>
                  <span>Mindset: {AFFIRMATIONS[quoteIdx].tag}</span>
                  <span>🌱 Calm & Steady</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ backgroundColor: "#FFFFFF", padding: "18px", borderRadius: "20px", border: "1px solid #E1E9E1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#1B4332" }}>Today's Progress</span>
                  <span style={{ fontSize: "16px", fontWeight: "800", color: "#2D6A4F" }}>{progressPercent}%</span>
                </div>
                <div style={{ width: "100%", height: "12px", backgroundColor: "#EBF3EB", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ width: `${progressPercent}%`, height: "100%", backgroundColor: "#52B788", transition: "width 0.4s ease" }} />
                </div>
                <span style={{ fontSize: "11px", color: "#778C7B", marginTop: "8px", display: "block" }}>
                  {completedCount} of {tasks.length} tasks completed
                </span>
              </div>

              {/* Jump to Clock */}
              <div onClick={() => setActiveTab("timer")} style={{ backgroundColor: "#EBF7EE", border: "1px solid #C5E8CE", padding: "16px", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: "800", color: "#2D6A4F", textTransform: "uppercase" }}>Focus Clock</div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#1B4332" }}>25-Min Nature Sprint</div>
                </div>
                <button style={{ backgroundColor: "#2D6A4F", color: "white", border: "none", padding: "8px 16px", borderRadius: "14px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                  Start Timer
                </button>
              </div>
            </>
          )}

          {/* TAB 2: TASKS */}
          {activeTab === "tasks" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#1B4332" }}>My Tasks</h2>
                <span style={{ backgroundColor: "#E8F5E9", color: "#2D6A4F", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "700" }}>
                  {tasks.filter(t => !t.completed).length} to go
                </span>
              </div>

              <form onSubmit={addTask} style={{ display: "flex", gap: "8px" }}>
                <input 
                  type="text" 
                  placeholder="Add a new mindful task..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  style={{ flex: 1, padding: "12px 14px", borderRadius: "14px", border: "1px solid #CCDBCD", fontSize: "13px", outline: "none" }}
                />
                <button type="submit" style={{ backgroundColor: "#2D6A4F", color: "white", border: "none", padding: "0 18px", borderRadius: "14px", cursor: "pointer", fontWeight: "700" }}>
                  <Plus size={18} />
                </button>
              </form>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    onClick={() => toggleTask(task.id)}
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between", 
                      padding: "14px", 
                      borderRadius: "16px", 
                      backgroundColor: task.completed ? "#F3F7F3" : "#FFFFFF", 
                      border: "1px solid #E1EAE1",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {task.completed ? <CheckCircle2 size={20} color="#2D6A4F" /> : <Circle size={20} color="#ADC2AE" />}
                      <div>
                        <span style={{ fontSize: "13px", fontWeight: "700", textDecoration: task.completed ? "line-through" : "none", color: task.completed ? "#8E9E8F" : "#1B4332", display: "block" }}>
                          {task.title}
                        </span>
                        <span style={{ fontSize: "10px", color: "#8E9E8F" }}>{task.category} • {task.time}</span>
                      </div>
                    </div>
                    <button onClick={(e) => deleteTask(task.id, e)} style={{ background: "none", border: "none", color: "#C48888", cursor: "pointer" }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* TAB 3: FOCUS CLOCK */}
          {activeTab === "timer" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "24px" }}>
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
                  {isRunning ? "Deep In Focus" : "Ready"}
                </span>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button 
                  onClick={toggleTimer} 
                  style={{ backgroundColor: "#2D6A4F", color: "white", border: "none", padding: "14px 28px", borderRadius: "18px", fontSize: "14px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 6px 16px rgba(45,106,79,0.3)" }}
                >
                  {isRunning ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start Focus</>}
                </button>
                <button 
                  onClick={resetTimer} 
                  style={{ backgroundColor: "#FFFFFF", border: "1px solid #D5E2D5", color: "#556B58", padding: "14px", borderRadius: "18px", cursor: "pointer" }}
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === "profile" && (
            <>
              <div style={{ backgroundColor: "#FFFFFF", padding: "20px", borderRadius: "24px", border: "1px solid #E1EAE1", display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "54px", height: "54px", borderRadius: "16px", backgroundColor: "#2D6A4F", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TreePine size={28} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#1B4332" }}>Forest Keeper</h3>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#52B788", fontWeight: "700" }}>Level 3 Gardener</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ backgroundColor: "#FFFFFF", padding: "18px", borderRadius: "20px", border: "1px solid #E1EAE1", textAlign: "center" }}>
                  <span style={{ fontSize: "26px", fontWeight: "900", color: "#1B4332", display: "block" }}>14</span>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#778C7B" }}>Trees Planted</span>
                </div>
                <div style={{ backgroundColor: "#FFFFFF", padding: "18px", borderRadius: "20px", border: "1px solid #E1EAE1", textAlign: "center" }}>
                  <span style={{ fontSize: "26px", fontWeight: "900", color: "#E07A5F", display: "block" }}>4 Days</span>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#778C7B" }}>Active Streak</span>
                </div>
              </div>

              <div style={{ backgroundColor: "#EBF5EC", padding: "18px", borderRadius: "20px", border: "1px solid #CCE4CF" }}>
                <span style={{ fontSize: "12px", fontWeight: "800", color: "#2D6A4F", display: "block", marginBottom: "6px" }}>
                  🌲 Your Garden
                </span>
                <div style={{ fontSize: "24px", display: "flex", gap: "8px" }}>
                  <span>🌲</span><span>🌳</span><span>🌲</span><span>🌱</span><span>🌲</span>
                </div>
              </div>
            </>
          )}

        </div>

        {/* 4 Bottom Tabs Navigation */}
        <div style={{ borderTop: "1px solid #E2EAE2", backgroundColor: "#FFFFFF", padding: "12px 20px", display: "flex", justifyContent: "space-around" }}>
          
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
            <span>Account</span>
          </button>

        </div>

      </div>
    </div>
  );
}