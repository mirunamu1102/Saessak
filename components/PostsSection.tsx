'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

type Post = {
  id: number
  type: 'log' | 'work'
  title: string
  content: string
  created_at: string
}

export default function PostsSection() {
  const [logs, setLogs] = useState<Post[]>([])
  const [works, setWorks] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: true })
      if (data) {
        setLogs(data.filter(p => p.type === 'log'))
        setWorks(data.filter(p => p.type === 'work'))
      }
      setLoading(false)
    }
    fetchPosts()
  }, [])

  const logEmojis = ['🤝','✍️','🖼️','💻','🚀','📚','🎯','💡','🔧','🌟']

  return (
    <>
      {/* 주간 학습 기록 */}
      <section id="log">
        <div className="inner">
          <p className="section-label">Weekly Log</p>
          <h2>주간 학습 기록</h2>
          <p className="lead">매주 배운 것을 솔직하게 남겨요. 작은 것도 기록이에요.</p>
          {loading ? (
            <p style={{color:'var(--text-muted)', fontSize:'14px'}}>불러오는 중...</p>
          ) : logs.length === 0 ? (
            <div style={{background:'var(--card-bg)', border:'2px dashed var(--border)', borderRadius:'var(--radius)', padding:'40px', textAlign:'center', color:'var(--text-muted)', fontSize:'14px'}}>
              아직 학습 기록이 없어요. 관리자 페이지에서 첫 번째 기록을 남겨보세요! 🌱
            </div>
          ) : (
            <div className="log-grid">
              {logs.map((log, i) => (
                <div key={log.id} className="log-card">
                  <div className="log-emoji">{logEmojis[i % logEmojis.length]}</div>
                  <div className="log-week">Week {i + 1}</div>
                  <h3>{log.title}</h3>
                  <p>{log.content}</p>
                </div>
              ))}
              <div className="log-card" style={{border:'2px dashed var(--border)', boxShadow:'none', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', background:'var(--warm-bg)'}}>
                <div className="log-emoji">📝</div>
                <h3 style={{color:'var(--text-muted)'}}>다음 주 기록 예정</h3>
                <p style={{color:'var(--text-muted)', fontSize:'13px'}}>계속 업데이트할게요!</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 작업물 */}
      <section id="works">
        <div className="inner">
          <p className="section-label">Works</p>
          <h2>내가 만든 것들</h2>
          <p className="lead">AI와 함께 만든 작업물을 모아요. 하나씩 채워가는 중이에요.</p>
          {loading ? (
            <p style={{color:'var(--text-muted)', fontSize:'14px'}}>불러오는 중...</p>
          ) : (
            <div className="works-grid">
              {works.map(work => (
                <div key={work.id} className="work-card ready">
                  <div className="work-icon">🌐</div>
                  <h3>{work.title}</h3>
                  <p>{work.content}</p>
                  <span className="work-chip">완성 ✓</span>
                </div>
              ))}
              <div className="work-card">
                <div className="work-icon">🔜</div>
                <p>다음 작업물 준비 중</p>
              </div>
              {works.length === 0 && (
                <div className="work-card">
                  <div className="work-icon">🔜</div>
                  <p>다음 작업물 준비 중</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
