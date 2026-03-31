import Image from 'next/image'
import { cn } from '@/lib/utils'

type SiteLogoProps = {
  className?: string
  imageClassName?: string
  alt?: string
  priority?: boolean
}

export function SiteLogo({
  className,
  imageClassName,
  alt = 'KOU AI logosu',
  priority = false,
}: SiteLogoProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-white ring-1 ring-border/80 shadow-sm',
        className
      )}
    >
      <Image
        src="/site-logo.png"
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 48px, 64px"
        className={cn('object-contain p-1.5', imageClassName)}
      />
    </div>
  )
}
