import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Icon from './Icon';
import { SignInToSaveModal } from './SignInToSaveModal';

type NotificationItem = {
  id: string;
  body?: string;
  kind: 'reply' | 'vote' | 'review' | string;
  actor_type?: string | null;
  actor_id?: string | null;
  source_type?: string;
  source_id?: string;
  url: string;
  created_at: string;
  read_at: string | null;
  dismissed_at?: string | null;
};

type NotificationPage = { items: NotificationItem[]; count: number; page: number; page_size: number; total_pages: number };

const apiBase = '/api/ugc/notifications';
const PAGE_SIZE = 10;

const mockRows: Array<{ kind: string; body: string; url: string }> = [
  { kind: 'reply', body: 'Jordan Lee replied to your comment on the 2026 Toyota Corolla.', url: '/vehicles/2026/Toyota/Corolla#comments' },
  { kind: 'vote', body: 'Avery Chen voted on your review of the 2025 BMW 3 Series.', url: '/vehicles/2025/BMW/3-Series#reviews' },
  { kind: 'review', body: 'Morgan Reyes posted a new review of a vehicle you own: 2026 Mazda CX-5.', url: '/vehicles/2026/Mazda/CX-5#reviews' },
  { kind: 'reply', body: 'Sam Patel replied to your question about the Honda CR-V.', url: '/vehicles/2026/Honda/CR-V#comments' },
  { kind: 'vote', body: 'Jamie Brooks voted on your comment about the Ford Bronco Sport.', url: '/vehicles/2026/Ford/Bronco-Sport#comments' },
  { kind: 'price_alert', body: 'There are new deals on the 2026 Honda Civic. View the latest incentives and deals for this vehicle.', url: '/vehicles/2026/Honda/Civic' },
  { kind: 'qa_answer', body: 'Taylor Kim answered your question about the 2026 Subaru Outback.', url: '/vehicles/2026/Subaru/Outback#questions' },
  { kind: 'bracket_voting', body: 'The next round for the Offroad Showdown is now open. Put your votes in now.', url: '/rankings-awards/offroad-showdown' },
  { kind: 'reply', body: 'Riley Scott replied to your comment on the 2026 Toyota RAV4.', url: '/vehicles/2026/Toyota/RAV4#comments' },
  { kind: 'review', body: 'Casey Nguyen reviewed a vehicle you own: 2026 Volkswagen Golf GTI.', url: '/vehicles/2026/Volkswagen/Golf-GTI#reviews' },
  { kind: 'vote', body: 'Quinn Davis voted on your review of the Mazda CX-50.', url: '/vehicles/2026/Mazda/CX-50#reviews' },
  { kind: 'price_alert', body: 'There are new deals on the 2026 Ford F-150. View the latest incentives and deals for this vehicle.', url: '/vehicles/2026/Ford/F-150' },
  { kind: 'qa_answer', body: 'Drew Parker answered your question about the 2026 Kia Sportage.', url: '/vehicles/2026/Kia/Sportage#questions' },
  { kind: 'reply', body: 'Alex Morgan replied to your comment on the 2026 Chevrolet Equinox.', url: '/vehicles/2026/Chevrolet/Equinox#comments' },
  { kind: 'bracket_voting', body: 'Voting is open for the next Offroad Showdown matchup.', url: '/rankings-awards/offroad-showdown' },
];

let mockNotifications: NotificationItem[] = mockRows.map((row, index) => ({
  id: `preview-notification-${index + 1}`,
  kind: row.kind,
  body: row.body,
  url: row.url,
  created_at: new Date(Date.now() - (index * 17 + 4) * 60_000).toISOString(),
  read_at: index === 3 || index === 8 ? new Date(Date.now() - index * 60_000).toISOString() : null,
  dismissed_at: null,
}));

function mockRequest<T>(path: string, options: RequestInit = {}): T {
  const url = new URL(`${apiBase}${path}`, window.location.origin);
  const method = options.method ?? 'GET';
  if (url.pathname.endsWith('/unread-count')) {
    return { count: mockNotifications.filter((item) => !item.read_at && !item.dismissed_at).length } as T;
  }
  if (url.pathname.endsWith('/read-all')) {
    mockNotifications = mockNotifications.map((item) => item.read_at ? item : { ...item, read_at: new Date().toISOString() });
    return { count: mockNotifications.length } as T;
  }
  if (url.pathname.endsWith('/read') || url.pathname.endsWith('/dismiss')) {
    const notificationId = (JSON.parse(String(options.body ?? '{}')) as { notification_id?: string }).notification_id;
    mockNotifications = mockNotifications.map((item) => item.id !== notificationId ? item : url.pathname.endsWith('/read')
      ? { ...item, read_at: item.read_at || new Date().toISOString() }
      : { ...item, dismissed_at: new Date().toISOString() });
    return {} as T;
  }
  if (method === 'GET') {
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('page_size') ?? PAGE_SIZE);
    const visible = mockNotifications.filter((item) => !item.dismissed_at);
    const start = (page - 1) * pageSize;
    return {
      items: visible.slice(start, start + pageSize),
      count: visible.length,
      page,
      page_size: pageSize,
      total_pages: Math.ceil(visible.length / pageSize),
    } as T;
  }
  return {} as T;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (options.body) headers.set('Content-Type', 'application/json');

  try {
    const response = await fetch(`${apiBase}${path}`, { ...options, headers, credentials: 'include' });
    if (!response.ok) {
      if (import.meta.env.DEV && response.status === 404) return mockRequest<T>(path, options);
      throw new Error(`Notification request failed (${response.status})`);
    }
    if (response.status === 204) return undefined as T;
    const contentType = response.headers.get('content-type') || '';
    if (import.meta.env.DEV && !contentType.includes('application/json')) return mockRequest<T>(path, options);
    return await response.json() as T;
  } catch (error) {
    if (import.meta.env.DEV && (error instanceof TypeError || error instanceof SyntaxError)) return mockRequest<T>(path, options);
    throw error;
  }
}

function isRead(item: NotificationItem) {
  return item.read_at !== null;
}

function relativeTime(value?: string) {
  if (!value) return 'Just now';
  const createdAt = new Date(value);
  if (Number.isNaN(createdAt.getTime())) return 'Just now';
  const elapsed = Math.max(0, Date.now() - createdAt.getTime());
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days < 7 ? `${days}d ago` : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(createdAt);
}

function actionLabel(item: NotificationItem) {
  const type = item.kind.toLowerCase();
  if (type.includes('price') || type.includes('deal') || type.includes('incentive')) return 'View deals';
  if (type.includes('bracket') || type.includes('offroad') || type.includes('showdown')) return 'Go to Bracket';
  if (type.includes('q&a') || type.includes('qa') || type.includes('question') || type.includes('answer')) return 'Go to Q&A';
  if (type.includes('review')) return 'Go to Review';
  if (type.includes('comment') || type.includes('reply') || type.includes('vote')) return 'Go to comment';
  return '';
}

function notificationTypeLabel(kind: string) {
  const type = kind.toLowerCase();
  if (type.includes('price') || type.includes('deal') || type.includes('incentive')) return 'PRICE ALERT';
  if (type.includes('bracket') || type.includes('offroad') || type.includes('showdown')) return 'BRACKET VOTING';
  if (type.includes('q&a') || type.includes('qa') || type.includes('question') || type.includes('answer')) return 'Q&A';
  if (type.includes('review')) return 'REVIEW';
  if (type.includes('vote')) return 'VOTE';
  return 'REPLY';
}

export function NotificationInbox() {
  const { user, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const signedIn = !!user && !user.isAnonymous;
  const previewMode = import.meta.env.DEV && !!user?.isAnonymous;
  const canViewInbox = signedIn || previewMode;
  const userId = user?.id;
  const [unreadCount, setUnreadCount] = useState(0);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [open, setOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [countError, setCountError] = useState(false);
  const [listError, setListError] = useState(false);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const rootRef = useRef<HTMLDivElement>(null);

  const refreshCount = useCallback(async () => {
    if (!canViewInbox) {
      setUnreadCount(0);
      setCountError(false);
      return;
    }
    try {
      const query = new URLSearchParams({ user_type: 'mylo', user_id: userId || 'demo_user' });
      const result = previewMode
        ? mockRequest<{ count: number }>(`/unread-count?${query}`)
        : await request<{ count: number }>(`/unread-count?${query}`);
      setUnreadCount(Number(result.count ?? 0));
      setCountError(false);
    } catch {
      setCountError(true);
    }
  }, [canViewInbox, previewMode, userId]);

  useEffect(() => {
    if (authLoading) return;
    void refreshCount();
  }, [authLoading, location.pathname, refreshCount]);

  useEffect(() => {
    if (!canViewInbox) return;
    const timer = window.setInterval(() => void refreshCount(), 5 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, [canViewInbox, refreshCount]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const loadFirstPage = useCallback(async () => {
    if (!userId && !previewMode) return;
    setLoadingList(true);
    setListError(false);
    try {
      const query = new URLSearchParams({ user_type: 'mylo', user_id: userId || 'demo_user', page: '1', page_size: String(PAGE_SIZE) });
      const page = previewMode
        ? mockRequest<NotificationPage>(`?${query}`)
        : await request<NotificationPage>(`?${query}`);
      setItems(page.items ?? []);
      setCurrentPage(1);
      setHasMore((page.total_pages ?? 1) > 1);
    } catch {
      setListError(true);
    } finally {
      setLoadingList(false);
    }
  }, [previewMode, userId]);

  const toggleOpen = () => {
    if (authLoading) return;
    if (!canViewInbox) {
      setSignInOpen(true);
      return;
    }
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen && canViewInbox) void loadFirstPage();
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore || (!userId && !previewMode)) return;
    setLoadingMore(true);
    try {
      const pageNumber = currentPage + 1;
      const query = new URLSearchParams({ user_type: 'mylo', user_id: userId || 'demo_user', page: String(pageNumber), page_size: String(PAGE_SIZE) });
      const page = previewMode
        ? mockRequest<NotificationPage>(`?${query}`)
        : await request<NotificationPage>(`?${query}`);
      setItems((current) => [...current, ...(page.items ?? [])]);
      setCurrentPage(pageNumber);
      setHasMore(pageNumber < (page.total_pages ?? pageNumber));
    } catch {
      setListError(true);
    } finally {
      setLoadingMore(false);
    }
  };

  const markRead = async (item: NotificationItem) => {
    if (isRead(item) || busyIds.has(item.id)) return;
    setBusyIds((current) => new Set(current).add(item.id));
    setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, read_at: new Date().toISOString() } : entry));
    setUnreadCount((count) => Math.max(0, count - 1));
    try {
      const options = { method: 'POST', body: JSON.stringify({ notification_id: item.id }) };
      if (previewMode) mockRequest('/read', options);
      else await request('/read', options);
    } catch {
      setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, read_at: null } : entry));
      setUnreadCount((count) => count + 1);
      setListError(true);
    } finally {
      setBusyIds((current) => { const next = new Set(current); next.delete(item.id); return next; });
    }
  };

  const openItem = async (item: NotificationItem) => {
    await markRead(item);
    const url = item.url;
    if (url && url.startsWith('/') && !url.startsWith('//')) {
      navigate(url.replaceAll('&amp;', '&'));
    } else if (url) {
      try {
        const destination = new URL(url, window.location.origin);
        if (destination.protocol === 'https:' && destination.origin !== window.location.origin) window.location.assign(destination.href);
      } catch { /* Ignore invalid notification destinations. */ }
    }
  };

  const markAllRead = async () => {
    setUnreadCount(0);
    setItems((current) => current.map((item) => ({ ...item, read_at: new Date().toISOString() })));
    try {
      const options = { method: 'POST', body: JSON.stringify({ user_type: 'mylo', user_id: userId || 'demo_user' }) };
      if (previewMode) mockRequest('/read-all', options);
      else await request('/read-all', options);
    } catch {
      setListError(true);
      await refreshCount();
      await loadFirstPage();
    }
  };

  const dismiss = async (item: NotificationItem) => {
    if (busyIds.has(item.id)) return;
    setBusyIds((current) => new Set(current).add(item.id));
    setItems((current) => current.filter((entry) => entry.id !== item.id));
    try {
      const options = { method: 'POST', body: JSON.stringify({ notification_id: item.id }) };
      if (previewMode) mockRequest('/dismiss', options);
      else await request('/dismiss', options);
    } catch {
      setItems((current) => [...current, item]);
      setListError(true);
    } finally {
      setBusyIds((current) => { const next = new Set(current); next.delete(item.id); return next; });
    }
  };

  return (
    <div className="mt-headless-notifications" ref={rootRef}>
      <button type="button" className="mt-notification-trigger" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}${countError ? ', count unavailable' : ''}`} aria-expanded={open} onClick={toggleOpen}>
        <Icon name="notifications" size={18} />
        {unreadCount > 0 && <span className="mt-notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {open && <section className="mt-notification-panel" role="dialog" aria-label="Notifications">
        <header className="mt-notification-panel-header">
          <strong>Notifications</strong>
          <div className="mt-notification-panel-actions">
            {unreadCount > 0 && <button type="button" className="mt-notification-action" onClick={() => void markAllRead()}>Mark all as read</button>}
            <button type="button" className="mt-notification-close" aria-label="Close notifications" onClick={() => setOpen(false)}><Icon name="close" size={18} /></button>
          </div>
        </header>
        {canViewInbox && loadingList && <p className="mt-notification-state">Loading notifications…</p>}
        {canViewInbox && !loadingList && listError && <div className="mt-notification-state"><p>Notifications are temporarily unavailable.</p><button type="button" className="mt-notification-action" onClick={() => void loadFirstPage()}>Try again</button></div>}
        {canViewInbox && !loadingList && !listError && items.length === 0 && <p className="mt-notification-state">You’re all caught up.</p>}
        {canViewInbox && !loadingList && items.length > 0 && <div className="mt-notification-list">
          {items.map((item) => {
            const label = actionLabel(item);
            const timestamp = item.created_at;
            return <article className={`mt-notification-item${isRead(item) ? '' : ' is-unread'}`} key={item.id}>
              <span className="mt-notification-avatar" aria-hidden="true"><img src="/images/mt-brand-icon.svg" alt="" /></span>
              <div className="mt-notification-main">
                <div className="mt-notification-eyebrow"><span>{notificationTypeLabel(item.kind)}{previewMode && <span className="mt-notification-info" title="Development preview">i</span>}</span>{previewMode && <small>Preview</small>}</div>
                <button type="button" className="mt-notification-content" onClick={() => void openItem(item)}>
                  <span className="mt-notification-summary">{item.body || 'You have a new notification.'}</span>
                </button>
                <small className="mt-notification-time">{relativeTime(timestamp)}</small>
                {label && <button type="button" className="mt-notification-primary" onClick={() => void openItem(item)}>{label}</button>}
                <div className="mt-notification-row-actions">
                  {!isRead(item) && <button type="button" disabled={busyIds.has(item.id)} onClick={() => void markRead(item)}>Mark read</button>}
                  <button type="button" disabled={busyIds.has(item.id)} onClick={() => void dismiss(item)}>Delete</button>
                </div>
              </div>
              {!isRead(item) && <span className="mt-notification-unread-dot" aria-label="Unread" />}
            </article>;
          })}
          {hasMore && <button type="button" className="mt-notification-more" disabled={loadingMore} onClick={() => void loadMore()}>{loadingMore ? 'Loading…' : 'Show more'}</button>}
        </div>}
      </section>}

      <SignInToSaveModal
        isOpen={signInOpen}
        onClose={() => setSignInOpen(false)}
        itemType="article"
        titleOverride="Sign in to see your notifications"
        copyOverride="Sign in or create a free account to keep up with replies, votes, and reviews across MotorTrend."
        iconOverride="notifications"
        saveIntent={false}
        appearance="dark"
        showSocialAuth={false}
      />

      <style>{`
        .mt-headless-notifications { position: relative; display: inline-flex; align-items: center; justify-content: center; color: #fff; }
        .mt-notification-trigger { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; padding: 0; border: 0; border-radius: 50%; background: transparent; color: inherit; cursor: pointer; }
        .mt-notification-trigger:hover, .mt-notification-trigger[aria-expanded="true"] { background: rgba(255,255,255,.12); }
        .mt-notification-badge { position: absolute; top: -3px; right: -4px; box-sizing: border-box; min-width: 20px; height: 20px; padding: 0 5px; border: 1px solid #141416; border-radius: 99px; background: #e90c17; color: #fff; font: 700 11px/18px Arial, sans-serif; text-align: center; }
        .mt-notification-panel { position: absolute; z-index: 1000; top: calc(100% + 12px); right: 0; box-sizing: border-box; width: min(420px, calc(100vw - 24px)); max-height: min(620px, calc(100vh - 90px)); overflow: hidden; margin: 0; padding: 0; border: 1px solid #343439; border-radius: 16px; background: #141416; color: #f7f7f8; box-shadow: 0 16px 44px rgba(0,0,0,.35); }
        .mt-notification-panel-header { display: flex; align-items: center; justify-content: space-between; box-sizing: border-box; min-height: 52px; margin: 0; padding: 0 20px; border-bottom: 1px solid #343439; }
        .mt-notification-panel-header strong { font-size: 17px; }
        .mt-notification-panel-actions { display: flex; align-items: center; gap: 8px; }
        .mt-notification-action, .mt-notification-close, .mt-notification-dismiss { border: 0; background: transparent; cursor: pointer; }
        .mt-notification-action { padding: 7px 9px; border-radius: 5px; color: #c6c6ca; font-size: 12px; font-weight: 400; }
        .mt-notification-action:hover { background: #29292d; color: #fff; }
        .mt-notification-close { display: grid; width: 32px; height: 32px; place-items: center; border-radius: 50%; color: #d0d0d4; }
        .mt-notification-close:hover { background: #29292d; color: #fff; }
        .mt-notification-list { max-height: min(560px, calc(100vh - 148px)); overflow-y: auto; }
        .mt-notification-item { position: relative; display: grid; grid-template-columns: 36px minmax(0, 1fr); align-items: start; gap: 10px; padding: 15px 20px; border-bottom: 1px solid #303034; background: #141416; }
        .mt-notification-item.is-unread { background: #141416; }
        .mt-notification-avatar { display: grid; width: 34px; height: 34px; margin-top: 20px; place-items: center; border-radius: 50%; background: #ed0011; }
        .mt-notification-avatar img { display: block; width: 20px; height: auto; filter: brightness(0) invert(1); }
        .mt-notification-main { display: grid; gap: 4px; min-width: 0; padding-right: 4px; }
        .mt-notification-eyebrow { display: flex; align-items: center; justify-content: space-between; min-height: 13px; color: #aeb7c6; font-size: 10px; font-weight: 800; letter-spacing: 1.4px; }
        .mt-notification-eyebrow small { color: #9298a5; font-size: 10px; font-weight: 400; letter-spacing: 0; }
        .mt-notification-info { display: inline-grid; width: 13px; height: 13px; margin-left: 6px; place-items: center; border: 1px solid #67d69a; border-radius: 50%; color: #67d69a; font-size: 9px; letter-spacing: 0; }
        .mt-notification-content { display: block; min-width: 0; padding: 0; border: 0; background: transparent; color: #f6f6f7; text-align: left; cursor: pointer; }
        .mt-notification-summary { font-size: 14px; line-height: 1.4; font-weight: 700; }
        .mt-notification-time { color: #9298a5; font-size: 11px; }
        .mt-notification-unread-dot { position: absolute; top: 22px; right: 19px; width: 7px; height: 7px; border-radius: 50%; background: #ed0011; }
        .mt-notification-row-actions { display: flex; gap: 12px; }
        .mt-notification-row-actions button { padding: 0; border: 0; background: transparent; color: #a6a6ad; font-size: 11px; font-weight: 700; cursor: pointer; }
        .mt-notification-row-actions button:hover { color: #fff; }
        .mt-notification-row-actions button:disabled { opacity: .5; cursor: wait; }
        .mt-notification-primary { justify-self: start; min-height: 30px; margin-top: 2px; padding: 5px 12px; border: 1px solid #ed0011; border-radius: 5px; background: #ed0011; color: #fff; font-size: 12px; font-weight: 700; cursor: pointer; }
        .mt-notification-primary:hover { background: #c90812; }
        .mt-notification-state { margin: 0; padding: 44px 20px; color: #b8b8bf; text-align: center; font-size: 14px; }
        .mt-notification-state p { margin: 0 0 10px; }
        .mt-notification-more { display: block; width: calc(100% - 32px); margin: 12px 16px 16px; padding: 10px; border: 1px solid #55555a; border-radius: 5px; background: #202024; color: #f4f4f6; font-weight: 700; cursor: pointer; }
        .mt-notification-more:hover { background: #303035; }
        .mt-notification-more:disabled { opacity: .6; cursor: wait; }
        .mt-notification-trigger:focus-visible, .mt-notification-action:focus-visible, .mt-notification-close:focus-visible, .mt-notification-content:focus-visible, .mt-notification-primary:focus-visible, .mt-notification-dismiss:focus-visible, .mt-notification-more:focus-visible { outline: 2px solid #2585df; outline-offset: 2px; }
        @media (max-width: 768px) { .mt-notification-panel { position: fixed; top: 64px; right: 12px; left: 12px; width: auto; max-height: calc(100vh - 76px); } .mt-notification-list { max-height: calc(100vh - 136px); } }
      `}</style>
    </div>
  );
}
