'use client'

import { CodeBlock } from './CodeBlock'
import Note from './note'

export const mdxComponents = {
  pre: CodeBlock,
  Note: Note,
}

export default mdxComponents 