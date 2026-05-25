import Link from 'next/link'
import { SearchAutocomplete } from './SearchAutocomplete'

interface Crumb {
  label: string
  href?: string
}

interface TopbarProps {
  crumbs?: Crumb[]
  initialQuery?: string
}

export function Topbar({ crumbs = [], initialQuery = '' }: TopbarProps) {
  return (
    <div className="tc-topbar">
      <div className="tc-topbar__crumbs">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1
          const content =
            c.href && !isLast ? (
              <Link href={c.href} className="tc-topbar__crumbLink">
                {c.label}
              </Link>
            ) : (
              <span className={isLast ? 'tc-topbar__crumbActive' : undefined}>{c.label}</span>
            )
          return (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {content}
              {!isLast && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 6 6 6-6 6" />
                </svg>
              )}
            </span>
          )
        })}
      </div>

      <SearchAutocomplete initialQuery={initialQuery} />
    </div>
  )
}
