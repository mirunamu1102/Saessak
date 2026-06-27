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

  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--warm-bg)', padding: '24px'}}>
      <div style={{background: '#fff', borderRadius: 'var(--radius)', padding: '40px', width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow)'}}>
        <h1 style={{fontSize: '24px', fontWeight: 800, marginBottom: '8px'}}>로그인</h1>
        <p style={{color: 'var(--text-soft)', fontSize: '14px', marginBottom: '32px'}}>
          계정이 없으신가요? <Link href="/signup" style={{color: 'var(--peach)', fontWeight: 700}}>회원가입</Link>
        </p>
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
