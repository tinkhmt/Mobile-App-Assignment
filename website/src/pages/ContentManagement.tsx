import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { BookOpen, CirclePlay, Languages, PencilLine, Search, ShieldCheck, Sparkles, Save } from 'lucide-react';
import { getLanguages, getQuestions, getTopics, type BackendLanguage, type BackendQuestion, type BackendTopic } from '../api/backend';

type ContentCategory = 'Language' | 'Topic' | 'Question';

type ContentItem = {
  id: string;
  title: string;
  subtitle: string;
  status: 'Published' | 'Draft';
  details: Array<[string, string]>;
};

const categoryMeta: Record<ContentCategory, { label: string; icon: ReactNode; description: string }> = {
  Language: {
    label: 'Languages',
    icon: <Languages size={16} />,
    description: 'Manage language packs and see their live catalog metadata from the backend.',
  },
  Topic: {
    label: 'Topics',
    icon: <BookOpen size={16} />,
    description: 'Review topic names and language assignments stored in MongoDB.',
  },
  Question: {
    label: 'Questions',
    icon: <CirclePlay size={16} />,
    description: 'Individual questions fetched directly from the backend /api/questions endpoint.',
  },
};

function formatLabel(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}

function ContentManagement() {
  const [category, setCategory] = useState<ContentCategory>('Language');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [draftTitle, setDraftTitle] = useState('');
  const [draftStatus, setDraftStatus] = useState('Published');
  const [languages, setLanguages] = useState<BackendLanguage[]>([]);
  const [topics, setTopics] = useState<BackendTopic[]>([]);
  const [questions, setQuestions] = useState<BackendQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Demo: Default to Free user. In production, get this from auth context/token
  const userPlan = 'Free';
  const userRole = 'ADMIN';
  const canBypassPremiumLocks = userRole === 'ADMIN';

  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      try {
        setLoading(true);
        const [languageData, topicData, questionData] = await Promise.all([
          getLanguages(),
          getTopics(),
          getQuestions(),
        ]);

        if (cancelled) {
          return;
        }

        setLanguages(languageData);
        setTopics(topicData);
        setQuestions(questionData);
        setSelectedId((currentId) => currentId || languageData[0]?.id || topicData[0]?.id || questionData[0]?.id || '');
        setError('');
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError.message : 'Failed to load content from the backend.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadContent();
    return () => {
      cancelled = true;
    };
  }, []);

  const languageLookup = useMemo(() => new Map(languages.map((language) => [language.id, language])), [languages]);
  const topicLookup = useMemo(() => new Map(topics.map((topic) => [topic.id, topic])), [topics]);

  const languageItems = useMemo<ContentItem[]>(() => languages.map((language) => ({
    id: language.id,
    title: language.name,
    subtitle: `${language.code} · language code from backend`,
    status: 'Published',
    details: [
      ['Code', language.code],
      ['Name', language.name],
      ['Collection', 'languages'],
    ],
  })), [languages]);

  const topicItems = useMemo<ContentItem[]>(() => topics.map((topic) => {
    const language = languageLookup.get(topic.languageId);
    return {
      id: topic.id,
      title: topic.name,
      subtitle: `${language?.name ?? 'Unknown language'} · ${topic.isPremium ? '👑 Premium' : 'Free'}`,
      status: 'Published',
      details: [
        ['Language', language?.name ?? topic.languageId],
        ['Language ID', topic.languageId],
        ['Topic name', topic.name],
        ['Access Level', topic.isPremium ? 'Premium' : 'Free'],
      ],
    };
  }), [languageLookup, topics]);

  const questionItems = useMemo<ContentItem[]>(() => {
    return questions.map((question) => {
      const topic = topicLookup.get(question.topicId);
      return {
        id: question.id,
        title: question.content.substring(0, 50) + (question.content.length > 50 ? '...' : ''),
        subtitle: `${topic?.name ?? 'Unknown topic'} · ${question.options.length} options`,
        status: 'Published',
        details: [
          ['Question ID', question.id],
          ['Topic', topic?.name ?? question.topicId],
          ['Content', question.content],
          ['Options', String(question.options.length)],
          ['Correct option', String(question.correctOptionIndex)],
        ],
      };
    });
  }, [questions, topicLookup]);

  const items = category === 'Language' ? languageItems : category === 'Topic' ? topicItems : questionItems;

  const filteredItems = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return items.filter((item) => item.title.toLowerCase().includes(search) || item.subtitle.toLowerCase().includes(search));
  }, [items, searchTerm]);

  const selectedItem = filteredItems.find((item) => item.id === selectedId) ?? filteredItems[0];
  const selectedTopic = category === 'Topic' ? topics.find((t) => t.id === selectedId) : undefined;
  const isPremiumContentAccessDenied = selectedTopic && selectedTopic.isPremium && !canBypassPremiumLocks && userPlan === 'Free';

  useEffect(() => {
    if (!selectedItem) {
      return;
    }

    setDraftTitle(selectedItem.title);
    setDraftStatus(selectedItem.status);
  }, [selectedItem]);

  return (
    <div>
      <div className="page-hero card mb-6">
        <div className="page-hero-copy">
          <span className="eyebrow">Content management</span>
          <h1>Live languages, topics, and questions from the backend.</h1>
          <p>The page reads directly from Mongo-backed endpoints so the admin view reflects the current catalog instead of a local fixture.</p>
        </div>
        <div className="page-hero-panel">
          <div>
            <strong>{languages.length} languages</strong>
            <span>Loaded from /api/languages</span>
          </div>
          <div>
            <strong>{topics.length} topics</strong>
            <span>Loaded from /api/topics</span>
          </div>
          <div>
            <strong>{questions.length} questions</strong>
            <span>Loaded from /api/questions</span>
          </div>
        </div>
      </div>

      {error && <div className="empty-state mb-6">{error}</div>}

      <div className="stat-grid">
        <div className="card stat-card">
          <div className="stat-icon accent-blue"><Languages size={24} /></div>
          <div className="stat-info">
            <h3>Languages</h3>
            <div className="value">{languages.length}</div>
            <div className="muted small">Records from the backend</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon accent-amber"><BookOpen size={24} /></div>
          <div className="stat-info">
            <h3>Topics</h3>
            <div className="value">{topics.length}</div>
            <div className="muted small">Grouped by language</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon accent-emerald"><ShieldCheck size={24} /></div>
          <div className="stat-info">
            <h3>Questions</h3>
            <div className="value">{questions.length}</div>
            <div className="muted small">Individual items from backend</div>
          </div>
        </div>
      </div>

      <div className="split-layout">
        <section className="card">
          <div className="card-header-row">
            <div>
              <h2>Content library</h2>
              <p className="muted">Toggle between live backend collections.</p>
            </div>
            <div className="chip-row">
              {(Object.keys(categoryMeta) as ContentCategory[]).map((itemCategory) => (
                <button
                  key={itemCategory}
                  className={`chip ${category === itemCategory ? 'chip-active' : ''}`}
                  onClick={() => {
                    setCategory(itemCategory);
                    const firstItemId = itemCategory === 'Language' ? languageItems[0]?.id : itemCategory === 'Topic' ? topicItems[0]?.id : questionItems[0]?.id;
                    setSelectedId(firstItemId ?? '');
                  }}
                >
                  {categoryMeta[itemCategory].icon}
                  {categoryMeta[itemCategory].label}
                </button>
              ))}
            </div>
          </div>

          <div className="toolbar">
            <div className="search-field">
              <Search size={18} />
              <input
                type="text"
                placeholder={`Search ${categoryMeta[category].label.toLowerCase()}...`}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="toolbar-note">
              <Sparkles size={16} />
              {categoryMeta[category].description}
            </div>
          </div>

          {loading ? (
            <div className="empty-state">Loading content from the backend...</div>
          ) : (
            <div className="item-list">
              {filteredItems.map((item) => {
                const topicData = category === 'Topic' ? topics.find((t) => t.id === item.id) : undefined;
                const isLocked = topicData?.isPremium && !canBypassPremiumLocks && userPlan === 'Free';
                return (
                  <button
                    key={item.id}
                    className={`item-row ${selectedId === item.id ? 'item-row-active' : ''} ${isLocked ? 'item-row-locked' : ''}`}
                    onClick={() => !isLocked && setSelectedId(item.id)}
                    disabled={isLocked}
                    title={isLocked ? 'Premium content - Upgrade to access' : undefined}
                  >
                    <div>
                      <div className="item-title-row">
                        <strong>{item.title}</strong>
                        <span className={`badge ${item.status === 'Published' ? 'badge-success' : 'badge-warning'}`}>{item.status}</span>
                        {isLocked && <span className="badge badge-premium">🔒 Premium</span>}
                      </div>
                      <p>{item.subtitle}</p>
                    </div>
                    <PencilLine size={16} />
                  </button>
                );
              })}
              {filteredItems.length === 0 && <div className="empty-state">No content matched your search.</div>}
            </div>
          )}
        </section>

        <aside className="card editor-card">
          <div className="card-header-row">
            <div>
              <h2>Editor</h2>
              <p className="muted">{isPremiumContentAccessDenied ? 'Premium content - Upgrade your plan' : 'Edit the current backend record snapshot.'}</p>
            </div>
            <button className="btn btn-primary" disabled={isPremiumContentAccessDenied}>
              <Save size={16} /> Save draft
            </button>
          </div>

          {isPremiumContentAccessDenied ? (
            <div className="empty-state" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
              <strong>Premium Content Locked</strong>
              <p style={{ marginTop: '0.5rem', color: 'var(--color-muted)' }}>This topic is only available to Premium subscribers. Upgrade your plan to access this content.</p>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Upgrade to Premium</button>
            </div>
          ) : selectedItem ? (
            <div className="editor-stack">
              <div>
                <label>Title</label>
                <input value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} />
              </div>
              <div className="grid-two">
                <div>
                  <label>Status</label>
                  <select value={draftStatus} onChange={(event) => setDraftStatus(event.target.value)}>
                    <option>Published</option>
                    <option>Draft</option>
                  </select>
                </div>
                <div>
                  <label>Category</label>
                  <input value={formatLabel(category)} readOnly />
                </div>
              </div>
              <div className="details-panel">
                {selectedItem.details.map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
              <div className="helper-panel">
                <strong>Data source</strong>
                <p>Questions are fetched individually from the /api/questions endpoint. Each question includes content, options, and the correct answer index.</p>
              </div>
            </div>
          ) : (
            <div className="empty-state">Pick an item to inspect.</div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default ContentManagement;
