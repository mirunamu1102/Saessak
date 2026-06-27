'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function NavBar() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function loadUser(sessionUser: User | null) {
      setUser(sessionUser)
      if (sessionUser) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', sessionUser.id).single()
        setIsAdmin(profile?.role === 'admin')
      } else {
        setIsAdmin(false)
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      loadUser(session?.user ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      loadUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <nav>
      <ul>
        <li><a href="#about">소개</a></li>
        <li><a href="#log">학습 로그</a></li>
        <li><a href="#works">작업물</a></li>
        <li><a href="#glossary">용어 설명</a></li>
        <li><a href="#guestbook">방명록</a></li>
        <li><a href="#cta">같이 가요</a></li>
        <li className="nav-auth">
          {user ? (
            <>
              {isAdmin && <Link href="/admin" style={{fontSize:'13px', color:'var(--brown)', fontWeight:700}}>관리자</Link>}
              <span style={{fontSize: '13px', color: 'var(--text-muted)'}}>
                {user.email?.split('@')[0]}
              </span>
              <button className="nav-logout" onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <Link href="/login" className="nav-login">로그인</Link>
          )}
        </li>
      </ul>
    </nav>
  )
}
