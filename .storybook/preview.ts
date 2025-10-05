import type { Preview } from '@storybook/react'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    layout: 'centered',
  },
}

export default preview

import '../src/app/globals.css'

export default {
  parameters: {
    controls: { expanded: true },
  },
}
