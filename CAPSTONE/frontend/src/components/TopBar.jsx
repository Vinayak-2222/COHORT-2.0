export default function TopBar({ sandboxId, activeTab, onTabChange, status }) {
  const tabs = [
    { id: 'preview', label: 'Preview' },
    { id: 'files', label: 'Editor' },
  ]

  return (
    <header
      className="flex items-center justify-between px-3 shrink-0"
      style={{ height: '44px', background: '#0d1424', borderBottom: '1px solid #1e2d45' }}>
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="flex items-center justify-center shrink-0 rounded"
          style={{ width: '26px', height: '26px', color: '#07111f', background: '#22d3ee' }}
          aria-hidden="true">
          <span className="text-sm font-bold">S</span>
        </div>
        <div className="min-w-0">
          <div className="text-xs font-semibold" style={{ color: '#e2e8f0' }}>Sandbox IDE</div>
          <div className="text-xs truncate" style={{ color: '#475569', maxWidth: '220px' }}>{sandboxId}</div>
        </div>
      </div>

      <nav className="flex items-center h-full" aria-label="Workspace views">
        {tabs.map((tab) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className="h-full px-4 text-xs font-medium cursor-pointer"
              style={{
                color: active ? '#67e8f9' : '#64748b',
                borderBottom: active ? '2px solid #22d3ee' : '2px solid transparent',
              }}>
              {tab.label}
            </button>
          )
        })}
      </nav>

      <div className="flex items-center gap-2 shrink-0">
        <span
          className="block rounded-full"
          style={{
            width: '7px',
            height: '7px',
            background: status === 'ready' ? '#10b981' : '#f59e0b',
          }} />
        <span className="text-xs" style={{ color: '#64748b' }}>
          {status === 'ready' ? 'Ready' : status}
        </span>
      </div>
    </header>
  )
}
