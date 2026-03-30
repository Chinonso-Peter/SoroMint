import React, { Suspense, lazy, useState } from 'react'
import axios from 'axios'
import {
  ArrowRight,
  BookOpenText,
  Coins,
  LayoutDashboard,
  List,
  Plus,
  ShieldCheck,
  Wallet,
} from 'lucide-react'

const DeveloperHub = lazy(() => import('./components/developer-hub'))

const API_BASE = 'http://localhost:5000/api'
const views = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'developer-hub', label: 'Developer Hub', icon: BookOpenText },
]

function App() {
  const [activeView, setActiveView] = useState('developer-hub')
  const [address, setAddress] = useState('')
  const [tokens, setTokens] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    decimals: 7,
  })
  const [isMinting, setIsMinting] = useState(false)

  const connectWallet = async () => {
    const mockAddress = `GB...${Math.random().toString(36).substring(7).toUpperCase()}`
    setAddress(mockAddress)
    fetchTokens(mockAddress)
  }

  const fetchTokens = async (userAddress) => {
    try {
      const response = await axios.get(`${API_BASE}/tokens/${userAddress}`)
      const tokenList = response.data?.data ?? response.data ?? []
      setTokens(Array.isArray(tokenList) ? tokenList : [])
    } catch (err) {
      console.error('Error fetching tokens', err)
    }
  }

  const updateFormData = (updates) => {
    setFormData((currentData) => ({
      ...currentData,
      ...updates,
    }))
  }

  const handleMint = async (event) => {
    event.preventDefault()

    if (!address) {
      alert('Connect wallet first')
      return
    }

    setIsMinting(true)

    try {
      const mockContractId = `C${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      const response = await axios.post(`${API_BASE}/tokens`, {
        ...formData,
        contractId: mockContractId,
        ownerPublicKey: address,
      })

      const createdToken = response.data?.data ?? response.data
      setTokens((currentTokens) => [...currentTokens, createdToken])
      setFormData({ name: '', symbol: '', decimals: 7 })
      alert('Token Minted Successfully!')
    } catch (err) {
      alert(`Minting failed: ${err.message}`)
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-stellar-blue p-3 shadow-lg shadow-blue-500/30">
            <Coins className="h-8 w-8 text-white" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-200/70">Platform</p>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Soro<span className="text-stellar-blue">Mint</span>
            </h1>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="view-switcher">
            {views.map((view) => {
              const Icon = view.icon
              const isActive = activeView === view.id

              return (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => setActiveView(view.id)}
                  className={`view-pill ${isActive ? 'view-pill-active' : ''}`}
                >
                  <Icon className="h-4 w-4" />
                  {view.label}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={connectWallet}
            className="btn-primary flex items-center gap-2"
          >
            <Wallet size={18} />
            {address ? `${address.substring(0, 6)}...${address.slice(-4)}` : 'Connect Wallet'}
          </button>
        </div>
      </header>

      {activeView === 'developer-hub' ? (
        <Suspense
          fallback={(
            <div className="glass-card flex min-h-[320px] items-center justify-center">
              <div className="space-y-3 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-sky-200/70">Developer Hub</p>
                <p className="text-lg font-medium text-white">Loading documentation...</p>
              </div>
            </div>
          )}
        >
          <DeveloperHub />
        </Suspense>
      ) : (
        <main className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="lg:col-span-1">
            <div className="glass-card">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
                <Plus size={20} className="text-stellar-blue" />
                Mint New Token
              </h2>
              <form onSubmit={handleMint} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-400">Token Name</label>
                  <input
                    type="text"
                    placeholder="e.g. My Stellar Asset"
                    className="input-field w-full"
                    value={formData.name}
                    onChange={(event) => updateFormData({ name: event.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-400">Symbol</label>
                  <input
                    type="text"
                    placeholder="e.g. MSA"
                    className="input-field w-full"
                    value={formData.symbol}
                    onChange={(event) => updateFormData({ symbol: event.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-400">Decimals</label>
                  <input
                    type="number"
                    className="input-field w-full"
                    value={formData.decimals}
                    onChange={(event) => updateFormData({ decimals: parseInt(event.target.value, 10) || 0 })}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isMinting}
                  className="btn-primary mt-4 flex w-full items-center justify-center gap-2"
                >
                  {isMinting ? 'Deploying...' : 'Mint Token'}
                  {!isMinting && <ArrowRight size={18} />}
                </button>
              </form>
            </div>
          </section>

          <section className="lg:col-span-2">
            <div className="glass-card min-h-[400px]">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
                <List size={20} className="text-stellar-blue" />
                My Assets
              </h2>

              {!address ? (
                <div className="flex h-64 flex-col items-center justify-center text-slate-500">
                  <ShieldCheck size={48} className="mb-4 opacity-20" />
                  <p>Connect your wallet to see your assets</p>
                </div>
              ) : tokens.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center text-slate-500">
                  <p>No tokens minted yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10 text-sm text-slate-400">
                        <th className="pb-4 font-medium">Name</th>
                        <th className="pb-4 font-medium">Symbol</th>
                        <th className="pb-4 font-medium">Contract ID</th>
                        <th className="pb-4 font-medium">Decimals</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {tokens.map((token, index) => (
                        <tr key={index} className="group transition-colors hover:bg-white/5">
                          <td className="py-4 font-medium">{token.name}</td>
                          <td className="py-4 text-slate-300">{token.symbol}</td>
                          <td className="max-w-[120px] truncate py-4 font-mono text-sm text-stellar-blue">
                            {token.contractId}
                          </td>
                          <td className="py-4 text-slate-400">{token.decimals}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </main>
      )}

      <footer className="mt-16 border-t border-white/5 pt-8 text-center text-sm text-slate-500">
        <p>&copy; 2026 SoroMint Platform. Built on Soroban.</p>
      </footer>
    </div>
  )
}

export default App
