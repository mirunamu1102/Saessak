'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

type Post = {
  id: number
  type: 'log' | 'work'
  title: string
  content: string
  created_at: string
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [authChecking, setAuthChecking] = useState(true)
  const [type, setType] = useState<'log' | 'work'>('log')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAdmin() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { router.push('/login'); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
      if (profile?.role !== 'admin') { router.push('/'); return }
      setAuthChecking(false)
      fetchPosts()
    }
    checkAdmin()
  }, [])

  async function fetchPosts() {
    setLoading(true)
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
    setPosts(data ?? [])
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    setError('')

    if (editingId) {
      const { error } = await supabase.from('posts').update({ type, title, content }).eq('id', editingId)
      if (error) setError('수정 중 오류가 발생했어요.')
    } else {
      const { error } = await supabase.from('posts').insert({ type, title, content })
      if (error) setError('저장 중 오류가 발생했어요.')
    }

    setTitle('')
    setContent('')
    setEditingId(null)
    setType('log')
    await fetchPosts()
    setSaving(false)
  }

  function startEdit(post: Post) {
    setEditingId(post.id)
    setType(post.type)
    setTitle(post.title)
    setContent(post.content)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setTitle('')
    setContent('')
    setType('log')
  }

  async function handleDelete(id: number) {
    if (!confirm('정말 삭제할까요?')) return
    await supabase.from('posts').delete().eq('id', id)
    await fetchPosts()
  }

  if (authChecking) {
    return <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)'}}>권한 확인 중...</div>
  }

  return (
    <div style={{minHeight:'100vh', background:'var(--warm-bg)', padding:'40px 24px'}}>
      <div style={{maxWidth:'700px', margin:'0 auto'}}>

        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px'}}>
          <h1 style={{fontSize:'24px', fontWeight:800}}>관리자 — 콘텐츠 관리</h1>
          <Link href="/" style={{fontSize:'13px', color:'var(--text-muted)'}}>← 홈으로</Link>
        </div>

        {/* 작성/수정 폼 */}
        <div style={{background:'#fff', borderRadius:'var(--radius)', padding:'28px', boxShadow:'var(--shadow)', marginBottom:'32px'}}>
          <h2 style={{fontSize:'16px', fontWeight:700, marginBottom:'20px'}}>
            {editingId ? '✏️ 글 수정하기' : '➕ 새 글 작성'}
          </h2>
          <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'14px'}}>
            <div style={{display:'flex', gap:'8px'}}>
              <button
                type="button"
                onClick={() => setType('log')}
                style={{padding:'8px 18px', borderRadius:'20px', border:'2px solid', fontFamily:'inherit', fontWeight:700, fontSize:'13px', cursor:'pointer',
                  borderColor: type === 'log' ? 'var(--peach)' : 'var(--border)',
                  background: type === 'log' ? 'var(--peach)' : '#fff',
                  color: type === 'log' ? '#fff' : 'var(--text-soft)'}}
              >📓 학습 기록</button>
              <button
                type="button"
                onClick={() => setType('work')}
                style={{padding:'8px 18px', borderRadius:'20px', border:'2px solid', fontFamily:'inherit', fontWeight:700, fontSize:'13px', cursor:'pointer',
                  borderColor: type === 'work' ? 'var(--peach)' : 'var(--border)',
                  background: type === 'work' ? 'var(--peach)' : '#fff',
                  color: type === 'work' ? '#fff' : 'var(--text-soft)'}}
              >🌐 결과물</button>
            </div>
            <input
              type="text"
              placeholder="제목"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              style={{padding:'10px 14px', border:'1px solid var(--border)', borderRadius:'10px', fontFamily:'inherit', fontSize:'14px'}}
            />
            <textarea
              placeholder="내용"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={4}
              style={{padding:'10px 14px', border:'1px solid var(--border)', borderRadius:'10px', fontFamily:'inherit', fontSize:'14px', resize:'vertical'}}
            />
            {error && <p style={{color:'#dc2626', fontSize:'13px'}}>{error}</p>}
            <div style={{display:'flex', gap:'8px'}}>
              <button type="submit" disabled={saving}
                style={{background:'var(--peach)', color:'#fff', fontWeight:700, fontSize:'14px', padding:'10px 24px', borderRadius:'10px', border:'none', cursor:'pointer', fontFamily:'inherit'}}>
                {saving ? '저장 중...' : editingId ? '수정 완료' : '저장하기'}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit}
                  style={{background:'var(--border)', color:'var(--text-soft)', fontWeight:700, fontSize:'14px', padding:'10px 24px', borderRadius:'10px', border:'none', cursor:'pointer', fontFamily:'inherit'}}>
                  취소
                </button>
              )}
            </div>
          </form>
        </div>

        {/* 목록 */}
        <h2 style={{fontSize:'16px', fontWeight:700, marginBottom:'16px'}}>저장된 글 목록</h2>
        {loading ? (
          <p style={{color:'var(--text-muted)', fontSize:'14px'}}>불러오는 중...</p>
        ) : posts.length === 0 ? (
          <div style={{background:'#fff', borderRadius:'var(--radius)', padding:'32px', textAlign:'center', color:'var(--text-muted)', fontSize:'14px'}}>
            아직 작성한 글이 없어요. 위에서 첫 글을 써보세요! 🌱
          </div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
            {posts.map(post => (
              <div key={post.id} style={{background:'#fff', borderRadius:'12px', padding:'20px 24px', boxShadow:'var(--shadow)', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'16px'}}>
                <div style={{flex:1}}>
                  <div style={{display:'flex', gap:'8px', alignItems:'center', marginBottom:'6px'}}>
                    <span style={{fontSize:'11px', fontWeight:700, padding:'2px 8px', borderRadius:'20px', background:'var(--peach-light)', color:'var(--brown)'}}>
                      {post.type === 'log' ? '📓 학습기록' : '🌐 결과물'}
                    </span>
                    <span style={{fontSize:'12px', color:'var(--text-muted)'}}>
                      {new Date(post.created_at).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <h3 style={{fontSize:'15px', fontWeight:700, marginBottom:'4px'}}>{post.title}</h3>
                  {post.content && <p style={{fontSize:'13px', color:'var(--text-soft)'}}>{post.content}</p>}
                </div>
                <div style={{display:'flex', gap:'6px', flexShrink:0}}>
                  <button onClick={() => startEdit(post)}
                    style={{fontSize:'12px', padding:'6px 12px', borderRadius:'8px', border:'1px solid var(--border)', background:'#fff', cursor:'pointer', fontFamily:'inherit'}}>
                    수정
                  </button>
                  <button onClick={() => handleDelete(post.id)}
                    style={{fontSize:'12px', padding:'6px 12px', borderRadius:'8px', border:'1px solid #fca5a5', background:'#fff', color:'#dc2626', cursor:'pointer', fontFamily:'inherit'}}>
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
