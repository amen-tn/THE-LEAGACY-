import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './supabase'

const FAMILY_PASSWORD = '1234'

const allowedMembers = [
  'Rchid', 'Rebh', 'Hbiba', 'Hssan',
  'Hedia', 'Mahmoud Stiti', 'Tasnim', 'Mariem',
  'Hajer', 'Yassin Mechergui', 'Ameni', 'Ela', 'Mohamed',
  'Olfa', 'Sami Stiti', 'Baraa', 'Mohamed Raslen',
  'Lamia', 'Samir Kahlaoui', 'Chahinez', 'Yasmina',
  'Sana', 'Sofien Mechergui', 'Ayet', 'Adem',
  'Bachir', 'Hafsia Stiti', 'Wahiba Toumi', 'Youssef Laabidi',
  'Amen Allah', 'Lina', 'Nadine', 'Hela Toumi', 'Mohamed Toumi',
  'Nerimen', 'Wassim', 'Yannis', 'Marwen Toumi',
  'Mohamed Amine Toumi', 'Zoo', 'Dorra Toumi',
  'Jahida Toumi', 'Hada', 'Romdhane Stiti',
  'Ghzel Toumi', 'Fadhila', 'Asma', 'Ishaq',
  'Achref Toumi', 'Ahmed Toumi', 'Dalila Toumi', 'Hbib',
  'Najeh Toumi', 'Aymen', 'Yakine', 'Zeineb',
  'Moez Toumi', 'Hanen', 'Elyne', 'Nabil Toumi',
  'Mohamed Aziz Toumi', 'Saleh Toumi', 'Jamila',
  'Firas', 'Mayssa', 'Dhia', 'Khadouja Toumi',
  'Fethi Stiti', 'Takwa Stiti', 'Neder Hafsouni',
  'Bilel Stiti', 'Layla', 'Hadil'
]

const family = [
  {
    name: 'Hbiba',
    role: 'The First Daughter',
    spouse: 'Hssan',
    children: [
      'Hedia + Mahmoud Stiti',
      'Hajer + Yassin Mechergui',
      'Olfa + Sami Stiti',
      'Lamia + Samir Kahlaoui',
      'Sana + Sofien Mechergui'
    ],
    details: [
      'Hedia and Mahmoud → Tasnim, Mariem',
      'Hajer and Yassin → Ameni, Ela, Mohamed',
      'Olfa and Sami → Baraa, Mohamed Raslen',
      'Lamia and Samir → Chahinez, Yasmina',
      'Sana and Sofien → Ayet, Adem'
    ]
  },
  {
    name: 'Bachir',
    role: 'The Second Child',
    spouse: 'Hafsia Stiti',
    children: [
      'Wahiba Toumi + Youssef Laabidi',
      'Hela Toumi + Mohamed Toumi',
      'Marwen Toumi',
      'Mohamed Amine Toumi (Zoo)',
      'Dorra Toumi'
    ],
    details: [
      'Wahiba and Youssef → Amen Allah, Lina, Nadine',
      'Hela and Mohamed → Nerimen, Wassim, Yannis',
      'Marwen → célibataire',
      'Mohamed Amine (Zoo) and Dorra are twins'
    ]
  },
  {
    name: 'Jahida Toumi',
    nickname: 'Hada',
    role: 'The Third Child',
    spouse: 'Romdhane Stiti',
    children: ['Informations à compléter'],
    details: [
      'Les informations concernant ses enfants seront ajoutées plus tard.'
    ]
  },
  {
    name: 'Ghzel Toumi',
    role: 'The Fourth Child',
    spouse: 'Fadhila',
    children: ['Asma', 'Achref Toumi', 'Ahmed Toumi'],
    details: [
      'Asma → Ishaq',
      'Achref → célibataire',
      'Ahmed → célibataire'
    ]
  },
  {
    name: 'Dalila Toumi',
    role: 'The Fifth Child',
    spouse: 'Hbib',
    children: [
      'Najeh Toumi + Aymen',
      'Moez Toumi + Hanen',
      'Nabil Toumi',
      'Mohamed Aziz Toumi'
    ],
    details: [
      'Najeh and Aymen → Yakine, Zeineb + 3 prénoms à compléter',
      'Moez and Hanen → Elyne',
      'Nabil → célibataire',
      'Mohamed Aziz → célibataire'
    ]
  },
  {
    name: 'Saleh Toumi',
    role: 'The Sixth Child',
    spouse: 'Jamila',
    children: ['Firas', 'Mayssa', 'Dhia'],
    details: ['Firas', 'Mayssa', 'Dhia']
  },
  {
    name: 'Khadouja Toumi',
    role: 'The Seventh Child',
    spouse: 'Fethi Stiti',
    children: [
      'Takwa Stiti + Neder Hafsouni',
      'Bilel Stiti',
      'Hadil Stiti'
    ],
    details: [
      'Takwa and Neder',
      'Bilel → Layla',
      'Hadil → célibataire'
    ]
  }
]

const memories = [
  {
    id: 1,
    type: 'photo',
    src: '/memories/photo-1.jpg',
    title: 'A Family Moment',
    description: 'A moment together, a memory forever.'
  },
  {
    id: 2,
    type: 'video',
    src: '/memories/video-1.mp4',
    title: 'Family Moments',
    description: 'A memory captured forever.'
  },
  {
    id: 3,
    type: 'video',
    src: '/memories/video-2.mp4',
    title: 'Together Forever',
    description: 'Our family, our story.'
  }
]

function App() {
  const [accessGranted, setAccessGranted] = useState(false)
  const [loginName, setLoginName] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isEntering, setIsEntering] = useState(false)

  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedMemory, setSelectedMemory] = useState(null)

  // FAMILY LETTERS
  const [letters, setLetters] = useState([])
  const [selectedLetter, setSelectedLetter] = useState(null)
  const [letterAuthor, setLetterAuthor] = useState('')
  const [letterTitle, setLetterTitle] = useState('')
  const [letterContent, setLetterContent] = useState('')
  const [lettersLoading, setLettersLoading] = useState(false)
  const [letterSaving, setLetterSaving] = useState(false)
  const [letterMessage, setLetterMessage] = useState('')
  const [letterError, setLetterError] = useState('')

  // FAMILY ACCESS
  const handleLogin = (event) => {
    event.preventDefault()

    const normalizedName = loginName.trim().toLowerCase()
    const isMember = allowedMembers.some(
      member => member.toLowerCase() === normalizedName
    )

    if (isMember && loginPassword === FAMILY_PASSWORD) {
      setLoginError('')
      setIsEntering(true)

      setTimeout(() => {
        setAccessGranted(true)
        window.scrollTo(0, 0)
      }, 1200)
    } else {
      setLoginError('Access denied. Please verify your information.')
      setLoginPassword('')
    }
  }

  // LOAD LETTERS FROM SUPABASE
  useEffect(() => {
    if (!accessGranted) return

    const loadLetters = async () => {
      setLettersLoading(true)
      setLetterError('')

      const { data, error } = await supabase
        .from('family_letters')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase loading error:', error)
        setLetterError('Unable to load the letters. Please try again.')
      } else {
        setLetters(data || [])
      }

      setLettersLoading(false)
    }

    loadLetters()
  }, [accessGranted])

  // PUBLISH A LETTER
  const handlePublishLetter = async (event) => {
    event.preventDefault()

    setLetterMessage('')
    setLetterError('')

    const author = letterAuthor.trim()
    const title = letterTitle.trim()
    const content = letterContent.trim()

    if (!author || !title || !content) {
      setLetterError('Please complete all the fields.')
      return
    }

    if (
      author.length < 2 ||
      author.length > 80 ||
      title.length > 120 ||
      content.length > 10000
    ) {
      setLetterError('Please check the length of your text.')
      return
    }

    setLetterSaving(true)

    const { data, error } = await supabase
      .from('family_letters')
      .insert([{ author, title, content }])
      .select()
      .single()

    if (error) {
      console.error('Supabase publishing error:', error)
      setLetterError('Your letter could not be published. Please try again.')
    } else {
      setLetters(previous => [data, ...previous])
      setLetterAuthor('')
      setLetterTitle('')
      setLetterContent('')
      setLetterMessage('Your letter has been added to our family archive.')
    }

    setLetterSaving(false)
  }

  // REVEAL ANIMATIONS
  useEffect(() => {
    if (!accessGranted) return

    const elements = document.querySelectorAll('.reveal')

    if (!('IntersectionObserver' in window)) {
      elements.forEach(element => element.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -45px 0px' }
    )

    elements.forEach(element => observer.observe(element))

    return () => observer.disconnect()
  }, [accessGranted])

  // ESCAPE KEY
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setSelected(null)
        setSelectedMemory(null)
        setSelectedLetter(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // FAMILY SEARCH
  const filteredFamily = family.filter(person => {
    const content = [
      person.name,
      person.nickname,
      person.spouse,
      ...person.children,
      ...person.details
    ].join(' ').toLowerCase()

    return content.includes(search.toLowerCase())
  })

  // SECURITY SCREEN
  if (!accessGranted) {
    return (
      <main className={`security-page ${isEntering ? 'security-exit' : ''}`}>
        <div className="security-glow"></div>
        <div className="security-circle circle-one"></div>
        <div className="security-circle circle-two"></div>

        <div className="security-content">
          <div className="security-symbol"><span>✦</span></div>

          <p className="security-overline">
            A PRIVATE PLACE FOR OUR FAMILY
          </p>

          <h1>THE <span>LEGACY</span></h1>

          <div className="security-divider">
            <span></span>✦<span></span>
          </div>

          <p className="security-subtitle">PRIVATE FAMILY ARCHIVE</p>

          <p className="security-description">
            Some stories are meant to be kept close.
            Welcome to the place where our memories,
            roots and generations live forever.
          </p>

          <form className="security-form" onSubmit={handleLogin}>
            <label htmlFor="family-name">YOUR FULL NAME</label>
            <input
              id="family-name"
              type="text"
              placeholder="Enter your family name"
              value={loginName}
              onChange={event => {
                setLoginName(event.target.value)
                setLoginError('')
              }}
              autoComplete="name"
              required
              disabled={isEntering}
            />

            <label htmlFor="family-password">FAMILY PASSWORD</label>
            <input
              id="family-password"
              type="password"
              placeholder="Enter the secret password"
              value={loginPassword}
              onChange={event => {
                setLoginPassword(event.target.value)
                setLoginError('')
              }}
              autoComplete="current-password"
              required
              disabled={isEntering}
            />

            {loginError && (
              <p className="security-error" role="alert">{loginError}</p>
            )}

            <button
              className="security-button"
              type="submit"
              disabled={isEntering}
            >
              <span>
                {isEntering ? 'WELCOME TO THE LEGACY...' : 'ACCESS THE ARCHIVE'}
              </span>
              <span>↗</span>
            </button>
          </form>

          <div className="security-footer">
            <span>PRIVATE ACCESS ONLY</span>
            <span>EST. WITH LOVE</span>
          </div>
        </div>
      </main>
    )
  }

  return (
    <div className="website">

      {/* NAVIGATION */}
      <nav className="navbar">
        <a href="#home" className="logo">
          THE <span>LEGACY</span>
          <small>THE FAMILY ARCHIVE</small>
        </a>

        <div className="nav-links">
          <a href="#home">HOME</a>
          <a href="#origins">OUR ORIGINS</a>
          <a href="#tree">FAMILY TREE</a>
          <a href="#memories">MEMORIES</a>
          <a href="#letters">LETTERS</a>
          <a href="#legacy">OUR LEGACY</a>
        </div>

        <a href="#tree" className="nav-cta">
          EXPLORE <span>↗</span>
        </a>
      </nav>

      {/* HERO */}
      <header className="hero" id="home">
        <div className="hero-image"></div>
        <div className="hero-shade"></div>
        <div className="hero-grain"></div>

        <div className="hero-content">
          <div className="hero-kicker">
            <span></span>
            A STORY THAT CONNECTS GENERATIONS
          </div>

          <h1>
            DIFFERENT
            <br />
            GENERATIONS<span>.</span>
            <br />
            <em>ONE LEGACY.</em>
          </h1>

          <p className="hero-description">
            A family is not just a name.
            It is a story, a history and a thousand memories.
          </p>

          <a href="#origins" className="hero-button">
            <span>DISCOVER OUR STORY</span>
            <span className="button-arrow">↗</span>
          </a>
        </div>

        <div className="hero-side-note">
          <span className="side-line"></span>
          <span>ROOTED IN LOVE</span>
          <span>CONNECTED FOREVER</span>
        </div>

        <div className="hero-bottom">
          <span>EST. WITH LOVE</span>
          <span>ONE FAMILY · ONE HISTORY</span>
          <a href="#origins">SCROLL TO EXPLORE ↓</a>
        </div>

        <div className="hero-index">
          <strong>01</strong><span> / 04</span>
        </div>
      </header>

      {/* ORIGINS */}
      <section className="origins section" id="origins">
        <div className="section-label reveal">
          <span>01</span>
          <span>WHERE IT ALL BEGAN</span>
          <i></i>
        </div>

        <div className="origins-content reveal">
          <div>
            <p className="eyebrow">THE ROOTS OF OUR FAMILY</p>
            <h2>Every story<br />has <em>a beginning.</em></h2>
          </div>

          <p className="origins-text">
            Before us, there were two people.
            Their lives became the beginning of a story
            that continues through generations.
            This is where our family legacy begins.
          </p>
        </div>

        <div className="grandparents reveal">
          <div className="grandparent-card">
            <span className="portrait-number">01</span>
            <div className="portrait-placeholder">R</div>
            <span className="person-label">THE GRANDFATHER</span>
            <h3>Rchid</h3>
            <p>The root of our family tree.</p>
          </div>

          <div className="union">
            <span>✦</span>
            <div></div>
            <small>ONE LEGACY</small>
          </div>

          <div className="grandparent-card">
            <span className="portrait-number">02</span>
            <div className="portrait-placeholder">R</div>
            <span className="person-label">IN LOVING MEMORY</span>
            <h3>Rebh</h3>
            <p>Forever remembered. Forever part of us.</p>
            <span className="memorial">✦ IN MEMORY ✦</span>
          </div>
        </div>

        <div className="descendants reveal">
          <span className="gold-line"></span>
          <h3>SEVEN CHILDREN</h3>
          <p>One beginning. Seven branches. Countless memories.</p>
          <a href="#tree">DISCOVER THEIR STORIES ↓</a>
        </div>
      </section>

      {/* FAMILY TREE */}
      <section className="tree-section section" id="tree">
        <div className="section-label reveal">
          <span>02</span>
          <span>THE FAMILY TREE</span>
          <i></i>
        </div>

        <div className="tree-heading reveal">
          <div>
            <p className="eyebrow">SEVEN BRANCHES · ONE FAMILY</p>
            <h2>Our <em>Family.</em></h2>
          </div>
          <p>
            Every branch has its own story.
            Together, they make our history.
          </p>
        </div>

        <div className="tree-root reveal">
          <span className="root-caption">THE FOUNDERS</span>
          <strong>Rchid <i>&</i> Rebh</strong>
          <small>THE FIRST GENERATION</small>
          <div className="root-ornament">✦</div>
        </div>

        <div className="tree-connector"></div>
        <div className="branch-count reveal">THEIR SEVEN CHILDREN</div>

        <div className="search-box reveal">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search a family member..."
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
          {search && (
            <button
              className="clear-search"
              onClick={() => setSearch('')}
            >
              CLEAR ×
            </button>
          )}
          <span className="search-hint">SEARCH</span>
        </div>

        <div className="family-grid">
          {filteredFamily.map(person => {
            const branchNumber = family.indexOf(person) + 1

            return (
              <article
                className="family-card reveal"
                key={person.name}
                style={{ '--delay': `${branchNumber * 65}ms` }}
              >
                <div className="card-top">
                  <span>BRANCH 0{branchNumber}</span>
                  <span className="card-star">✦</span>
                </div>

                <div className="card-avatar">{person.name.charAt(0)}</div>
                <p className="person-label">{person.role}</p>
                <h3>{person.name}</h3>

                {person.nickname && (
                  <span className="nickname">“{person.nickname}”</span>
                )}

                <div className="card-divider"></div>
                <p className="spouse-label">LIFE PARTNER</p>
                <p className="spouse-name">{person.spouse}</p>

                <p className="children-count">
                  {person.children.length} CHILDREN / ENTRIES
                </p>

                <button
                  className="details-button"
                  onClick={() => setSelected(person)}
                >
                  EXPLORE BRANCH <span>↗</span>
                </button>
              </article>
            )
          })}
        </div>

        {filteredFamily.length === 0 && (
          <p className="no-results">
            No family member found. Try another name.
          </p>
        )}
      </section>

      {/* MEMORIES */}
      <section className="memories-section section" id="memories">
        <div className="section-label reveal">
          <span>03</span>
          <span>OUR MEMORIES</span>
          <i></i>
        </div>

        <div className="memories-heading reveal">
          <div>
            <p className="eyebrow">MOMENTS THAT NEVER FADE</p>
            <h2>Our <em>Memories.</em></h2>
          </div>
          <p>
            Some moments pass.
            The memories stay with us forever.
          </p>
        </div>

        <div className="cinema-intro reveal">
          <span className="gold-line"></span>
          <p>THE LEGACY PRESENTS</p>
          <h3>OUR PRIVATE FAMILY CINEMA</h3>
          <span className="cinema-subtitle">
            A COLLECTION OF MOMENTS THAT WILL LIVE FOREVER
          </span>
        </div>

        <div className="memories-grid">
          {memories.map((memory, index) => (
            <article
              className={`memory-card memory-card-${index + 1}`}
              key={memory.id}
              style={{ '--delay': `${index * 120}ms` }}
            >
              <button
                className="memory-image-wrap"
                onClick={() => setSelectedMemory(memory)}
                aria-label={`Open ${memory.title}`}
              >
                {memory.type === 'video' ? (
                  <video
                    src={memory.src}
                    preload="metadata"
                    playsInline
                    muted
                    className="memory-thumbnail"
                  />
                ) : (
                  <img
                    src={memory.src}
                    alt={memory.title}
                    loading="lazy"
                  />
                )}

                <span className="memory-image-shade"></span>
                <span className="film-tag">
                  {memory.type === 'video' ? 'FILM' : 'PHOTO'} 0{memory.id}
                </span>

                <span className="cinema-overlay">
                  <span className="cinema-play">
                    {memory.type === 'video' ? '▶' : '↗'}
                  </span>
                  <span className="cinema-caption">
                    {memory.type === 'video' ? 'WATCH FILM' : 'VIEW MEMORY'}
                  </span>
                </span>
              </button>

              <div className="memory-info">
                <span>THE LEGACY ARCHIVE · 0{memory.id}</span>
                <h3>{memory.title}</h3>
                <p>{memory.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="memories-ending reveal">
          <span>✦</span>
          <p>Every picture holds a story. Every story belongs to us.</p>
        </div>
      </section>

      {/* FAMILY LETTERS */}
      <section className="letters-section section" id="letters">
        <div className="section-label reveal">
          <span>04</span>
          <span>WORDS FROM THE HEART</span>
          <i></i>
        </div>

        <div className="letters-heading reveal">
          <div>
            <p className="eyebrow">A PLACE FOR OUR WORDS</p>
            <h2>Family <em>Letters.</em></h2>
          </div>
          <p>
            Some words deserve to stay.
            Some messages deserve to be remembered.
            This space belongs to every member of our family.
          </p>
        </div>

        <div className="letters-intro reveal">
          <span className="gold-line"></span>
          <span className="letters-symbol">✉</span>
          <h3>LEAVE A PIECE OF YOUR STORY</h3>
          <p>
            Write a message, share a memory, express your gratitude
            or leave a few words for the generations to come.
          </p>
        </div>

        <div className="letter-editor reveal">
          <div className="letter-editor-top">
            <span>THE FAMILY CORRESPONDENCE</span>
            <span>✦</span>
          </div>

          <form onSubmit={handlePublishLetter} className="letter-form">
            <label htmlFor="letter-author">YOUR NAME</label>
            <input
              id="letter-author"
              type="text"
              placeholder="Who is writing this letter?"
              value={letterAuthor}
              onChange={event => setLetterAuthor(event.target.value)}
              maxLength={80}
              required
            />

            <label htmlFor="letter-title">LETTER TITLE</label>
            <input
              id="letter-title"
              type="text"
              placeholder="Give your letter a title..."
              value={letterTitle}
              onChange={event => setLetterTitle(event.target.value)}
              maxLength={120}
              required
            />

            <label htmlFor="letter-content">YOUR WORDS</label>
            <textarea
              id="letter-content"
              placeholder="Dear family..."
              value={letterContent}
              onChange={event => setLetterContent(event.target.value)}
              maxLength={10000}
              rows={8}
              required
            />

            <div className="letter-form-bottom">
              <span>{letterContent.length} / 10000 characters</span>
              <button
                type="submit"
                className="letter-submit"
                disabled={letterSaving}
              >
                {letterSaving ? 'PUBLISHING...' : 'PUBLISH YOUR LETTER'}
                <span>↗</span>
              </button>
            </div>

            {letterMessage && (
              <p className="letter-success" role="status">
                ✦ {letterMessage}
              </p>
            )}

            {letterError && (
              <p className="letter-error" role="alert">
                {letterError}
              </p>
            )}
          </form>
        </div>

        <div className="published-letters reveal">
          <div className="published-heading">
            <div>
              <p className="eyebrow">THE WORDS WE KEEP</p>
              <h3>Letters from <em>our family.</em></h3>
            </div>
            <span className="letters-count">
              {letters.length} {letters.length === 1 ? 'LETTER' : 'LETTERS'}
            </span>
          </div>

          {lettersLoading && (
            <p className="letters-empty">Opening the family archive...</p>
          )}

          {!lettersLoading && letterError && (
            <p className="letters-empty">{letterError}</p>
          )}

          {!lettersLoading && !letterError && letters.length === 0 && (
            <div className="letters-empty">
              <span>✉</span>
              <h3>The first page is waiting to be written.</h3>
              <p>Be the first to leave a letter in our family archive.</p>
            </div>
          )}

          <div className="letters-grid">
            {letters.map(letter => (
              <article className="published-letter" key={letter.id}>
                <div className="published-letter-top">
                  <span>THE LEGACY ARCHIVE</span>
                  <span>✦</span>
                </div>

                <div className="published-letter-icon">❝</div>
                <h4>{letter.title}</h4>

                <p className="published-letter-preview">
                  {letter.content.length > 150
                    ? `${letter.content.slice(0, 150)}...`
                    : letter.content}
                </p>

                <div className="published-letter-footer">
                  <div>
                    <span>WRITTEN BY</span>
                    <strong>{letter.author}</strong>
                  </div>

                  <button
                    onClick={() => setSelectedLetter(letter)}
                    className="read-letter-button"
                  >
                    READ LETTER ↗
                  </button>
                </div>

                <span className="letter-date">
                  {letter.created_at
                    ? new Date(letter.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })
                    : ''}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* LEGACY */}
      <section className="legacy-section section" id="legacy">
        <div className="legacy-glow"></div>
        <div className="legacy-content reveal">
          <p className="eyebrow">MORE THAN A FAMILY TREE</p>
          <span className="legacy-star">✳</span>
          <h2>
            Different generations.
            <br />
            <em>One legacy.</em>
          </h2>
          <p>
            Our names may be different.
            Our stories may be unique.
            But our roots will always connect us.
          </p>
          <a href="#home" className="hero-button">
            <span>BACK TO THE BEGINNING</span>
            <span className="button-arrow">↑</span>
          </a>
          <div className="legacy-signature">MY FAMILY · FOREVER</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <a href="#home" className="logo">
          THE <span>LEGACY</span>
          <small>THE FAMILY ARCHIVE</small>
        </a>
        <p>Made with love, for generations to come.</p>
        <span>© MY FAMILY — OUR STORY CONTINUES</span>
      </footer>

      {/* FAMILY BRANCH MODAL */}
      {selected && (
        <div
          className="modal-backdrop"
          onClick={() => setSelected(null)}
        >
          <div
            className="family-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.name} family branch`}
            onClick={event => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              ×
            </button>

            <p className="eyebrow">{selected.role}</p>
            <h2>{selected.name}</h2>

            {selected.nickname && (
              <p className="nickname">Also known as {selected.nickname}</p>
            )}

            <div className="modal-divider"></div>
            <p className="spouse-label">LIFE PARTNER</p>
            <h3>{selected.spouse}</h3>
            <p className="spouse-label modal-children-title">
              CHILDREN & DESCENDANTS
            </p>

            <div className="descendant-list">
              {selected.details.map((detail, index) => (
                <div className="descendant-item" key={index}>
                  <span>✦</span>
                  {detail}
                </div>
              ))}
            </div>

            <p className="modal-note">
              This family branch can be completed and updated over time.
            </p>
          </div>
        </div>
      )}

      {/* MEMORY VIEWER */}
      {selectedMemory && (
        <div
          className="memory-viewer"
          onClick={() => setSelectedMemory(null)}
        >
          <button
            className="memory-viewer-close"
            onClick={() => setSelectedMemory(null)}
            aria-label="Close memory"
          >
            ×
          </button>

          <div
            className="memory-viewer-content"
            onClick={event => event.stopPropagation()}
          >
            {selectedMemory.type === 'video' ? (
              <video
                src={selectedMemory.src}
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img src={selectedMemory.src} alt={selectedMemory.title} />
            )}

            <p className="eyebrow">A MEMORY FROM OUR FAMILY</p>
            <h2>{selectedMemory.title}</h2>
            <p>{selectedMemory.description}</p>
          </div>
        </div>
      )}

      {/* LETTER READING VIEWER */}
      {selectedLetter && (
        <div
          className="letter-viewer"
          onClick={() => setSelectedLetter(null)}
        >
          <div
            className="letter-viewer-paper"
            role="dialog"
            aria-modal="true"
            aria-label={selectedLetter.title}
            onClick={event => event.stopPropagation()}
          >
            <button
              className="letter-viewer-close"
              onClick={() => setSelectedLetter(null)}
              aria-label="Close letter"
            >
              ×
            </button>

            <span className="letter-viewer-overline">
              THE LEGACY · FAMILY CORRESPONDENCE
            </span>

            <span className="letter-viewer-symbol">✦</span>
            <h2>{selectedLetter.title}</h2>
            <div className="letter-viewer-divider"></div>

            <p className="letter-viewer-content">
              {selectedLetter.content}
            </p>

            <div className="letter-viewer-signature">
              <span>WITH LOVE,</span>
              <strong>{selectedLetter.author}</strong>
            </div>

            <span className="letter-viewer-date">
              {selectedLetter.created_at
                ? new Date(selectedLetter.created_at).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })
                : ''}
            </span>
          </div>
        </div>
      )}

    </div>
  )
}

export default App