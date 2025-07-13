import { LucideProps } from "lucide-react"

export const Icons = {
  brain: (props: LucideProps) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5" />
      <path d="M15 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2M9 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2M15 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2M9 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
    </svg>
  ),
  upload: (props: LucideProps) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  ),
  xray: (props: LucideProps) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M4 8V6a2 2 0 0 1 2-2h2" />
      <path d="M4 16v2a2 2 0 0 0 2 2h2" />
      <path d="M16 4h2a2 2 0 0 1 2 2v2" />
      <path d="M16 20h2a2 2 0 0 0 2-2v-2" />
      <rect x="8" y="8" width="8" height="8" rx="1" />
    </svg>
  ),
  user: (props: LucideProps) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  download: (props: LucideProps) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  ),
  share: (props: LucideProps) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  ),
  alert: (props: LucideProps) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0" />
      <line x1="12" x2="12" y1="9" y2="13" />
      <line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
  ),
  trendUp: (props: LucideProps) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="m22 7-8.5 8.5-5-5L2 17" />
      <path d="M16 7h6v6" />
    </svg>
  ),
  trendDown: (props: LucideProps) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="m22 17-8.5-8.5-5 5L2 7" />
      <path d="M16 17h6v-6" />
    </svg>
  ),
  trendFlat: (props: LucideProps) => (
    <svg {...props} viewBox="0 0 24 24">
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  ),
  activity: (props: LucideProps) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}