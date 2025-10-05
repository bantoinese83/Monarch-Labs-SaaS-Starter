'use client'

import React from 'react'

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}

export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return <div className={`animate-pulse bg-black/30 rounded ${className}`} {...props} />
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`grunge-paper rounded-lg p-4 space-y-3 ${className}`}>
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-6 w-1/2" />
    </div>
  )
}
