'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin'
  const errorParam = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(
    errorParam === 'unauthorized' ? 'You do not have admin access.' : ''
  )
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push(redirect)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <Input
        id="email"
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="admin@sshomestaging.com"
      />
      <Input
        id="password"
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="Your password"
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Button type="submit" loading={loading} className="w-full">
        Sign In
      </Button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-stone-900">
            SSHome<span className="font-light text-stone-400"> Admin</span>
          </h1>
          <p className="mt-2 text-sm text-stone-500">Sign in to manage your projects and leads.</p>
        </div>

        <Suspense fallback={<div className="mt-8 h-48 animate-pulse rounded-lg bg-stone-100" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
