import Link from 'next/link'

interface LogoProps {
  href?: string
  size?: 'sm' | 'md' | 'lg'
  reversed?: boolean
}

const sizes = {
  sm: { mark: 20, text: 'text-base' },
  md: { mark: 26, text: 'text-xl' },
  lg: { mark: 36, text: 'text-3xl' },
}

function LogoMark({ width, reversed }: { width: number; reversed?: boolean }) {
  const green = reversed ? '#A8C49E' : '#698C60'
  const clay = reversed ? '#D4A088' : '#C17F60'

  return (
    <svg
      width={width}
      height={Math.round(width * 1.167)}
      viewBox="0 0 48 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M 24 42 C 17 32, 17 16, 24 5 C 31 16, 31 32, 24 42 Z" fill={green} />
      <path d="M 24 42 C 17 36, 5 26, 6 13 C 13 13, 18 26, 24 42 Z" fill={green} opacity="0.82" />
      <path d="M 24 42 C 31 36, 43 26, 42 13 C 35 13, 30 26, 24 42 Z" fill={green} opacity="0.82" />
      <circle cx="24" cy="44" r="2" fill={clay} opacity="0.7" />
    </svg>
  )
}

export function Logo({ href = '/', size = 'md', reversed = false }: LogoProps) {
  const { mark, text } = sizes[size]
  const textColor = reversed ? 'text-white' : 'text-[var(--color-foreground)]'

  return (
    <Link href={href} className="inline-flex items-center gap-2.5 select-none">
      <LogoMark width={mark} reversed={reversed} />
      <span
        className={`font-display font-light tracking-[0.12em] uppercase ${text} ${textColor} leading-none`}
      >
        Velora
      </span>
    </Link>
  )
}

export function LogoMarkOnly({ size = 'md', reversed = false }: Omit<LogoProps, 'href'>) {
  const { mark } = sizes[size]
  return <LogoMark width={mark} reversed={reversed} />
}
