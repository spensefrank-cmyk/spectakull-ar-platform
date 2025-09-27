import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', asChild = false, children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"

    const variants = {
      default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
    }

    const sizes = {
      sm: "h-8 rounded-md px-3 text-xs",
      default: "h-9 px-4 py-2",
      lg: "h-10 rounded-md px-8",
    }

    const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`

    if (asChild && children && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
        className: combinedClasses,
        ...props
      })
    }

    return (
      <button className={combinedClasses} ref={ref} {...props}>
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"
export { Button }
