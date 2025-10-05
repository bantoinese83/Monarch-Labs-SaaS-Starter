'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from './button'

type EmptyStateProps = {
  icon?: React.ReactNode
  title: string
  description?: string
  actionHref?: string
  actionLabel?: string
}

export function EmptyState({ icon, title, description, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {icon && <div className="mx-auto h-12 w-12 text-gray-400">{icon}</div>}
      <h3 className="mt-2 text-sm grunge-headline">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-400">{description}</p>}
      {actionHref && actionLabel && (
        <div className="mt-6">
          <Link href={actionHref}>
            <Button>{actionLabel}</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
