'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

type Entry = {
  id: number
  message: string
  created_at: string
  profiles: { anonymous_number: number } | null
}

export default function GuestbookSection() {
  const [user, setUser] = useState<User | null>(null)
  const [entries, setEntries] = useState<Entry[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    fetchEntries()
  }, [])

  async function fetchEntries() {
    const { data } = await supabase
      .from('guestbook')
      .select('id, message, created_at, profiles(anonymous_number)')
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) setEntries(data as Entry[])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setLoading(true)
    await supabase.from('guestbook').insert({ message: message.trim(), user_id: user?.id })
    setMessage('')
    await fetchEntries()
    setLoading(false)
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <section id="guestbook">
      <div className="inner">
        <p className="section-label">Guestbook</p>
        <h2>방명록 💌</h2>
        <p className="lead">방문해 주셔서 감사해요. 한 마디 남겨주세요!</p>

        {user ? (
          <form className="guestbook-form" onSubmit={handleSubmit}>
            <textarea
              placeholder="따뜻한 한 마디를 남겨주세요 ☕"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? '저장 중...' : '방명록 남기기'}
            </button>
          </form>
        ) : (
          <div className="guestbook-login-notice">
            방명록을 남기려면 <Link href="/login">로그인</Link>이 필요해요.&nbsp;
            계정이 없으신가요? <Link href="/signup">회원가입</Link>
          </div>
        )}

        <div className="guestbook-list">
          {entries.length === 0 && (
            <p style={{color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '24px'}}>
              아직 방명록이 없어요. 첫 번째로 남겨보세요! 🌱
            </p>
          )}
          {entries.map(entry => (
            <div key={entry.id} className="guestbook-entry">
              <div className="guestbook-entry-header">
                <span className="guestbook-entry-name">
                  익명{entry.profiles?.anonymous_number ?? '?'}
                </span>
                <span className="guestbook-entry-date">{formatDate(entry.created_at)}</span>
              </div>
              <p className="guestbook-entry-message">{entry.message}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
