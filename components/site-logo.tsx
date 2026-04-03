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
    <div className={cn('relative', className)}>
      <Image
        src="/site-logo.gif"
        alt={alt}
        fill
        priority={priority}
        unoptimized
        sizes="(max-width: 768px) 48px, 64px"
        className={cn('object-contain', imageClassName)}
      />
    </div>
  )
}
