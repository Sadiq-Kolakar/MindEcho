import { Moon, Sparkles } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

type ThemeToggleProps = {
  className?: string
  compact?: boolean
}

export function ThemeToggle({ className = '', compact = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isNight = theme === 'monochrome'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isNight}
      aria-label={
        isNight
          ? 'Switch to warm mocha theme'
          : 'Switch to night black and white theme'
      }
      title={isNight ? 'Warm mocha theme' : 'Night black & white theme'}
      className={`theme-toggle glass-hover flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold transition ${className}`}
    >
      {isNight ? (
        <Sparkles className="theme-toggle-icon h-3.5 w-3.5" />
      ) : (
        <Moon className="theme-toggle-icon h-3.5 w-3.5" />
      )}
      {!compact && <span className="theme-toggle-label">{isNight ? 'Warm' : 'Night'}</span>}
    </button>
  )
}
