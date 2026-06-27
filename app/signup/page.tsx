'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 현재 가입자 수 확인해서 익명 번호 부여
    const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    const anonymousNumber = (count ?? 0) + 1

    const { data, error: signupError } = await supabase.auth.signUp({ email, password })
    if (signupError) {
      setError('회원가입에 실패했어요. 이메일 형식과 비밀번호(6자 이상)를 확인해 주세요.')
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        role: 'user',
        anonymous_number: anonymousNumber,
      })
    }

    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--warm-bg)', padding: '24px'}}>
        <div style={{background: '#fff', borderRadius: 'var(--radius)', padding: '40px', width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow)', textAlign: 'center'}}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>📬</div>
          <h2 style={{fontSize: '20px', fontWeight: 800, marginBottom: '12px'}}>이메일을 확인해 주세요!</h2>
          <p style={{color: 'var(--text-soft)', fontSize: '14px', marginBottom: '24px'}}>
            가입하신 이메일로 인증 링크를 보냈어요.<br />링크를 클릭하면 가입이 완료돼요.
          </p>
          <Link href="/login" style={{color: 'var(--peach)', fontWeight: 700, fontSize: '14px'}}>로그인 페이지로 →</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--warm-bg)', padding: '24px'}}>
      <div style={{background: '#fff', borderRadius: 'var(--radius)', padding: '40px', width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow)'}}>
        <h1 style={{fontSize: '24px', fontWeight: 800, marginBottom: '8px'}}>회원가입</h1>
        <p style={{color: 'var(--text-soft)', fontSize: '14px', marginBottom: '32px'}}>
          이미 계정이 있으신가요? <Link href="/login" style={{color: 'var(--peach)', fontWeight: 700}}>로그인</Link>
        </p>
        <form onSubmit={handleSignup} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
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
            <label style={{display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px'}}>비밀번호 (6자 이상)</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              style={{width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '10px', fontFamily: 'inherit', fontSize: '14px'}}
            />
          </div>
          {error && <p style={{color: '#dc2626', fontSize: '13px'}}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{background: 'var(--peach)', color: '#fff', fontWeight: 700, fontSize: '15px', padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit'}}
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>
        <div style={{marginTop: '24px', textAlign: 'center'}}>
          <Link href="/" style={{color: 'var(--text-muted)', fontSize: '13px'}}>← 홈으로 돌아가기</Link>
        </div>
      </div>
    </div>
  )
}
