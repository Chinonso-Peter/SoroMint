import { fireEvent, render, screen } from '@testing-library/react'
import App from './App'
import { describe, expect, it } from 'vitest'

describe('Developer hub interface', () => {
  it('renders the developer hub by default', async () => {
    render(<App />)

    expect(screen.getByRole('button', { name: /developer hub/i })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: /build against soromint without leaving the ui/i })).toBeInTheDocument()
    expect(screen.getAllByText(/^API Reference$/i).length).toBeGreaterThan(0)
  })

  it('switches between documentation sections from the side navigation', async () => {
    render(<App />)

    fireEvent.click(await screen.findByRole('button', { name: /authentication/i }))

    expect(await screen.findByRole('heading', { level: 1, name: /backend authentication/i })).toBeInTheDocument()
    expect(screen.getAllByText(/jwt-based auth flow/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/jwt_secret/i)).toBeInTheDocument()
  })

  it('renders syntax-highlighted code snippets inside markdown content', async () => {
    const { container } = render(<App />)

    await screen.findByRole('heading', { name: /build against soromint without leaving the ui/i })
    expect(container.querySelector('pre code.hljs')).toBeTruthy()
  })

  it('still allows switching back to the dashboard view', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /dashboard/i }))

    expect(screen.getByText(/mint new token/i)).toBeInTheDocument()
    expect(screen.getByText(/my assets/i)).toBeInTheDocument()
  })
})
