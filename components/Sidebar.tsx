"use client";

interface SidebarProps {
  activeView?: string;
}

export default function Sidebar({ activeView = "board" }: SidebarProps) {
  const views = [
    {
      id: "board",
      name: "Board",
      icon: (
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
      ),
    },
    {
      id: "list",
      name: "List",
      icon: (
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6"/>
          <line x1="8" y1="12" x2="21" y2="12"/>
          <line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/>
          <line x1="3" y1="12" x2="3.01" y2="12"/>
          <line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      ),
    },
    {
      id: "notes",
      name: "Notes",
      badge: 4,
      icon: (
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
    },
  ];

  const projects = [
    { id: "stoa", name: "Stoa Dashboard" },
    { id: "growth", name: "Growth Machina" },
  ];

  const team = [
    { id: "jason", name: "Jason", icon: "user" },
    { id: "jc", name: "JC", icon: "bot" },
  ];

  const CircleIcon = () => (
    <svg className="w-[18px] h-[18px] opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-[18px] h-[18px] opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );

  const BotIcon = () => (
    <svg className="w-[18px] h-[18px] opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="10" rx="2"/>
      <circle cx="12" cy="5" r="2"/>
    </svg>
  );

  return (
    <aside className="w-sidebar bg-[#1f1f1f] border-r border-border flex-shrink-0 py-5 px-4 overflow-y-auto">
      {/* Views Section */}
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wider text-text-disabled mb-2 px-2">
          Views
        </div>
        {views.map((view) => (
          <div
            key={view.id}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 text-sm ${
              activeView === view.id
                ? "bg-surface-hover text-text"
                : "text-text-muted hover:bg-surface-hover hover:text-text"
            }`}
          >
            {view.icon}
            <span>{view.name}</span>
            {view.badge && (
              <span className="ml-auto bg-accent text-accent-light text-[11px] px-1.5 py-0.5 rounded font-medium">
                {view.badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Projects Section */}
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wider text-text-disabled mb-2 px-2">
          Projects
        </div>
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 text-sm text-text-muted hover:bg-surface-hover hover:text-text"
          >
            <CircleIcon />
            <span>{project.name}</span>
          </div>
        ))}
      </div>

      {/* Team Section */}
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wider text-text-disabled mb-2 px-2">
          Team
        </div>
        {team.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 text-sm text-text-muted hover:bg-surface-hover hover:text-text"
          >
            {member.icon === "user" ? <UserIcon /> : <BotIcon />}
            <span>{member.name}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
