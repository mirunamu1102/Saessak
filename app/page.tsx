import NavBar from '@/components/NavBar'
import PostsSection from '@/components/PostsSection'
import GuestbookSection from '@/components/GuestbookSection'

export default function Home() {
  return (
    <>
      <NavBar />

      <section id="hero">
        <div className="inner">
          <span className="hero-badge">✦ AI 클래스 학습 일지</span>
          <h1>막막했던 나도<br /><em>매주 하나씩</em> 배우고 있어요</h1>
          <p>AI가 어렵게 느껴지시나요? 저도 그랬어요. 그냥 한 발짝씩 같이 걸어봐요 — 당신도 충분히 할 수 있어요.</p>
          <a href="#log" className="btn">학습 기록 보기</a>
          <a href="#cta" className="btn-outline">같이 시작하기</a>
        </div>
      </section>

      <section id="about">
        <div className="inner">
          <p className="section-label">About</p>
          <h2>안녕하세요, 미려이에요 👋</h2>
          <div className="about-card">
            <p>저는 AI를 전혀 모르던 평범한 사람이었어요. &ldquo;AI가 대세&rdquo;라는 말은 자꾸 들리는데, 정작 어디서부터 시작해야 할지 몰라서 막막했죠.</p>
            <p>그러다 <abbr title="세미클래스 — AI 도구를 실생활에 적용하는 소규모 스터디 모임">세미클래스</abbr> AI 소모임을 알게 됐어요. 부담 없이 매주 조금씩 배우다 보니 어느새 이 페이지를 직접 만들게 됐답니다. 🎉</p>
            <p>이 페이지는 제가 배운 것들을 솔직하게 기록하는 공간이에요. 잘하는 척 없이, 헤매고 배우는 과정을 그대로 남겨요.</p>
            <div className="tag-row">
              <span className="tag">🌱 AI 초심자</span>
              <span className="tag">📓 매주 학습 중</span>
              <span className="tag">☕ 커피 마시며 공부</span>
              <span className="tag">✨ 세미클래스 멤버</span>
            </div>
          </div>
        </div>
      </section>

      <PostsSection />

      <section id="glossary">
        <div className="inner">
          <p className="section-label">Glossary</p>
          <h2>헷갈리는 단어 모음</h2>
          <p className="lead">이 페이지에 나오는 IT·AI 용어를 쉽게 정리했어요.</p>
          <dl className="glossary-list">
            <div className="glossary-item">
              <dt>AI (에이아이)</dt>
              <dd>인공지능(Artificial Intelligence). 사람처럼 생각하고 대답하도록 훈련된 컴퓨터 프로그램이에요. ChatGPT, Claude 같은 것들이 AI예요.</dd>
            </div>
            <div className="glossary-item">
              <dt>프롬프트 (Prompt)</dt>
              <dd>AI에게 보내는 질문이나 지시문. &ldquo;이렇게 해줘&rdquo;라고 말하는 것 자체가 프롬프트예요. 어떻게 말하느냐에 따라 AI의 답이 크게 달라져요.</dd>
            </div>
            <div className="glossary-item">
              <dt>Claude Code</dt>
              <dd>Anthropic이라는 회사가 만든 AI 코딩 도우미. 코딩을 몰라도 &ldquo;이런 사이트 만들어줘&rdquo;라고 말하면 코드를 만들어줘요.</dd>
            </div>
            <div className="glossary-item">
              <dt>Vercel (버셀)</dt>
              <dd>내 컴퓨터에서 만든 사이트를 인터넷에 무료로 올릴 수 있게 해주는 서비스. 배포하면 링크 하나로 전 세계 누구나 내 사이트를 볼 수 있어요.</dd>
            </div>
            <div className="glossary-item">
              <dt>배포 (Deploy)</dt>
              <dd>내 컴퓨터 안에만 있던 파일을 인터넷에 올려서 누구나 접근할 수 있게 만드는 것. &ldquo;앱 출시&rdquo;라고 생각하면 쉬워요.</dd>
            </div>
            <div className="glossary-item">
              <dt>GitHub (깃허브)</dt>
              <dd>코드를 저장하고 관리하는 온라인 서비스. 마치 코드 전용 구글 드라이브 같은 거예요. Vercel과 연결하면 자동으로 배포도 돼요.</dd>
            </div>
          </dl>
        </div>
      </section>

      <section id="cta">
        <div className="inner">
          <p className="section-label" style={{color: 'var(--peach-light)'}}>Join Us</p>
          <h2>관심 있으면 같이 가요 ☕</h2>
          <p className="lead">저도 처음엔 아무것도 몰랐어요. AI가 어렵게 느껴지더라도, 소모임에서 같이 배우면 훨씬 수월해요. 궁금한 거 있으면 편하게 물어보세요!</p>
          <a href="#" className="btn-white">세미클래스 소모임 보기</a>
          <a href="#" className="btn-ghost">궁금한 거 물어보기</a>
        </div>
      </section>

      <GuestbookSection />

      <footer>
        <p>© 2026 미려 · AI 클래스 학습 일지 · Made with Claude Code & ☕</p>
      </footer>
    </>
  )
}
