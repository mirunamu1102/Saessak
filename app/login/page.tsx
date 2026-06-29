'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않아요.')
    } else {
      router.push('/')
    }
    setLoading(false)
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--warm-bg)', padding: '24px'}}>
      <div style={{background: '#fff', borderRadius: 'var(--radius)', padding: '40px', width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow)'}}>
        <h1 style={{fontSize: '24px', fontWeight: 800, marginBottom: '8px'}}>로그인</h1>
        <p style={{color: 'var(--text-soft)', fontSize: '14px', marginBottom: '32px'}}>
          계정이 없으신가요? <Link href="/signup" style={{color: 'var(--peach)', fontWeight: 700}}>회원가입</Link>
        </p>

        {/* Google 로그인 버튼 */}
        <button
          onClick={handleGoogleLogin}
          style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: '15px', fontWeight: 600, marginBottom: '20px'}}
        >
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
          Google 계정으로 로그인
        </button>

        <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px'}}>
          <div style={{flex: 1, height: '1px', background: 'var(--border)'}} />
          <span style={{fontSize: '12px', color: 'var(--text-muted)'}}>또는 이메일로</span>
          <div style={{flex: 1, height: '1px', background: 'var(--border)'}} />
        </div>

        <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <div>
            <label style={{display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px'}}>이메일</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '10px', fontFamily: 'inherit', fontSize: '14px'}}
            />
          </div>
          <div>
            <label style={{display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px'}}>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '10px', fontFamily: 'inherit', fontSize: '14px'}}
            />
          </div>
          {error && <p style={{color: '#dc2626', fontSize: '13px'}}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{background: 'var(--peach)', color: '#fff', fontWeight: 700, fontSize: '15px', padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit'}}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <div style={{marginTop: '24px', textAlign: 'center'}}>
          <Link href="/" style={{color: 'var(--text-muted)', fontSize: '13px'}}>← 홈으로 돌아가기</Link>
        </div>
      </div>
    </div>
  )
}
