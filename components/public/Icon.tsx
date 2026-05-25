// SVG stroke icons extraídos de public/modelo/components/icons.jsx
// Mantemos apenas os que o app realmente usa.

import type { CSSProperties } from 'react'

type IconName =
  | 'search'
  | 'arrow-right'
  | 'arrow-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'home'
  | 'layout-dashboard'
  | 'trending-up'
  | 'clock'
  | 'bookmark'
  | 'flame'
  | 'eye'
  | 'rocket'
  | 'edit'
  | 'globe'
  | 'mail'
  | 'server'
  | 'shield'
  | 'credit-card'
  | 'users'
  | 'book'
  | 'file-text'
  | 'database'
  | 'lock'
  | 'settings'
  | 'log-out'
  | 'thumbs-up'
  | 'thumbs-down'
  | 'zap'
  | 'tag'
  | 'plus'
  | 'help-circle'

const paths: Record<IconName, React.ReactNode> = {
  search: (<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>),
  'arrow-right': (<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>),
  'arrow-left': (<><path d="M19 12H5" /><path d="m11 6-6 6 6 6" /></>),
  'chevron-right': (<path d="m9 6 6 6-6 6" />),
  'chevron-down': (<path d="m6 9 6 6 6-6" />),
  home: (<><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /></>),
  'layout-dashboard': (<>
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </>),
  'trending-up': (<><path d="m3 17 6-6 4 4 8-8" /><path d="M14 7h7v7" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  bookmark: (<path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16l7-4z" />),
  flame: (<path d="M12 2s4 3 4 7c0 2-1 3-2 3.5 0 0 1-2-1-4 0 0 0 4-3 5.5-2 1-3 2.5-3 4.5 0 3 3 4.5 5 4.5s5-1.5 5-5c0-3-3-5-3-7" />),
  eye: (<><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>),
  rocket: (<>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15 9 12a11 11 0 0 1 6-9.5 11 11 0 0 1 6 6A11 11 0 0 1 12 15z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </>),
  edit: (<>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4z" />
  </>),
  globe: (<>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
  </>),
  mail: (<>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </>),
  server: (<>
    <rect x="3" y="4" width="18" height="7" rx="1.5" />
    <rect x="3" y="13" width="18" height="7" rx="1.5" />
    <circle cx="7" cy="7.5" r=".8" fill="currentColor" />
    <circle cx="7" cy="16.5" r=".8" fill="currentColor" />
  </>),
  shield: (<path d="M12 3 4 6v6c0 4.5 3.5 8 8 9 4.5-1 8-4.5 8-9V6z" />),
  'credit-card': (<>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </>),
  users: (<>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M3 20c0-3 2.7-5.5 6-5.5s6 2.5 6 5.5" />
    <path d="M16 4.5a3.5 3.5 0 0 1 0 7" />
    <path d="M17 14.5c2.7.5 4.5 2.7 4.5 5.5" />
  </>),
  book: (<>
    <path d="M4 4.5C4 3.7 4.7 3 5.5 3H11v17H5.5c-.8 0-1.5-.7-1.5-1.5z" />
    <path d="M20 4.5c0-.8-.7-1.5-1.5-1.5H13v17h5.5c.8 0 1.5-.7 1.5-1.5z" />
  </>),
  'file-text': (<>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8" />
    <path d="M8 17h5" />
  </>),
  database: (<>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v6c0 1.7 4 3 9 3s9-1.3 9-3V5" />
    <path d="M3 11v6c0 1.7 4 3 9 3s9-1.3 9-3v-6" />
  </>),
  lock: (<>
    <rect x="4" y="11" width="16" height="11" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </>),
  settings: (<>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </>),
  'log-out': (<>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
  </>),
  'thumbs-up': (<>
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11l1.86-3.72A1 1 0 0 1 12.31 5h.31a2 2 0 0 1 2 2z" />
  </>),
  'thumbs-down': (<>
    <path d="M17 14V2" />
    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11l-1.86 3.72A1 1 0 0 1 9.69 19h-.31a2 2 0 0 1-2-2z" />
  </>),
  zap: (<path d="M13 2 3 14h9l-1 8 10-12h-9z" />),
  tag: (<>
    <path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z" />
    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
  </>),
  plus: (<>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </>),
  'help-circle': (<>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4" />
    <circle cx="12" cy="17" r=".8" fill="currentColor" />
  </>),
}

interface IconProps {
  name: IconName
  size?: number
  strokeWidth?: number
  style?: CSSProperties
  className?: string
}

export function Icon({ name, size = 20, strokeWidth = 1.75, style, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

export type { IconName }
