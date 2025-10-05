import React from 'react'
import { render, screen } from '@testing-library/react'
import { Button } from './button'

it('renders button text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})
