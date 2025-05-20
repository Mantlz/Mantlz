'use client'

import { CopyButton } from './CopyButton'
import type { ComponentProps } from 'react'

function extractTextFromChildren(children: any): string {
  if (typeof children === 'string') {
    return children
  }
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join('')
  }
  if (children?.props?.children) {
    return extractTextFromChildren(children.props.children)
  }
  return ''
}

export function CodeBlock({ children, className, ...rest }: ComponentProps<'pre'>) {
  const text = extractTextFromChildren(children)

  return (
    <div className="relative">
      <CopyButton text={text} />
      <pre className={className} {...rest}>
        <code className={className}>{children}</code>
      </pre>
    </div>
  )
} 