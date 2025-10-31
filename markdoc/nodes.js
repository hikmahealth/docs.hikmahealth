import { nodes as defaultNodes } from '@markdoc/markdoc'
import Link from 'next/link'

import { Fence } from '@/components/Fence'

const nodes = {
  document: {
    render: undefined,
  },
  th: {
    ...defaultNodes.th,
    attributes: {
      ...defaultNodes.th.attributes,
      scope: {
        type: String,
        default: 'col',
      },
    },
  },
  fence: {
    render: Fence,
    attributes: {
      language: {
        type: String,
      },
    },
  },
  link: {
    ...defaultNodes.link,
    render: ({ href, children }) => {
      const isExternal = href?.startsWith('http://') || href?.startsWith('https://') || href?.startsWith('mailto:')

      if (isExternal) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        )
      }

      return <Link href={href}>{children}</Link>
    },
  },
}

export default nodes
