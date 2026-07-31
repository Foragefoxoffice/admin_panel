import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Badge, Button, Tooltip, Tag } from 'antd';
import {
  UploadOutlined,
  UserOutlined,
  BellOutlined,
  TagsOutlined,
  PictureOutlined,
  BookOutlined,
  FolderOpenOutlined,
  BarChartOutlined,
  ExportOutlined,
  SendOutlined,
  StopOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  ShoppingOutlined,
  CreditCardOutlined,
  GiftOutlined,
  SnippetsOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  CrownOutlined,
  InboxOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import useAuth from '@/contexts/useAuth.jsx';

const { Sider, Content, Header } = Layout;

const PRIMARY      = '#693f86';
const PRIMARY_DARK = '#3d1a5c';
const PRIMARY_MID  = '#512878';
const PRIMARY_LIGHT = '#f3eaff';

/* ─── Menu definition ──────────────────────────────────────────────────────── */
function buildMenuItems(navigate) {
  const go = (path) => () => navigate(path);

  return [
    {
      key: 'test-series-group',
      icon: <SnippetsOutlined />,
      label: 'Test Series',
      children: [
        { key: '/admin/test-series',           label: 'Packages',  icon: <InboxOutlined />,   onClick: go('/admin/test-series') },
        { key: '/admin/test-series/questions', label: 'Questions', icon: <QuestionCircleOutlined />, onClick: go('/admin/test-series/questions') },
        { key: '/admin/test-series/purchases', label: 'Purchases', icon: <ShoppingOutlined />, onClick: go('/admin/test-series/purchases') },
        { key: '/admin/test-series/banners',   label: 'Banners',   icon: <PictureOutlined />,  onClick: go('/admin/test-series/banners') },
      ],
    },
    { key: '/admin/types', icon: <TagsOutlined />,            label: 'Types',         onClick: go('/admin/types') },
    {
      key: 'questions-group',
      icon: <QuestionCircleOutlined />,
      label: 'Questions',
      children: [
        { key: '/admin/questions', label: 'All Questions', icon: <UnorderedListOutlined />, onClick: go('/admin/questions') },
        { key: '/admin/upload',    label: 'Upload',        icon: <UploadOutlined />,        onClick: go('/admin/upload') },
        { key: '/admin/question',  label: 'Add Question',  icon: <PlusOutlined />,          onClick: go('/admin/question') },
        { key: '/admin/export',    label: 'Export',        icon: <ExportOutlined />,         onClick: go('/admin/export') },
      ],
    },
    {
      key: 'users-group',
      icon: <UserOutlined />,
      label: 'Users',
      children: [
        { key: '/admin/user',     label: 'All Users', icon: <UserOutlined />,    onClick: go('/admin/user') },
        { key: '/admin/coupons',  label: 'Coupons',   icon: <GiftOutlined />,    onClick: go('/admin/coupons') },
        { key: '/admin/payments', label: 'Payments',  icon: <CreditCardOutlined />, onClick: go('/admin/payments') },
      ],
    },
    {
      key: 'neet-group',
      icon: <CrownOutlined />,
      label: 'NEET Plans',
      children: [
        { key: '/admin/neet-plans',        label: 'All Plans',    icon: <UnorderedListOutlined />, onClick: go('/admin/neet-plans') },
        { key: '/admin/neet-plans/create', label: 'Create Plan',  icon: <PlusOutlined />,          onClick: go('/admin/neet-plans/create') },
        { key: '/admin/Plan Features', label: 'Plan Features',  icon: <QuestionCircleOutlined />,          onClick: go('/admin/subscription-features') },
      ],
    },
    {
      key: 'materials-group',
      icon: <BookOutlined />,
      label: 'Materials',
      children: [
        { key: '/admin/materials',        label: 'All Materials', icon: <FolderOpenOutlined />, onClick: go('/admin/materials') },
        { key: '/admin/material-upload',  label: 'Add Material',  icon: <UploadOutlined />,     onClick: go('/admin/material-upload') },
        { key: '/admin/pdf-premium',      label: 'Premium Blocks',icon: <StopOutlined />,       onClick: go('/admin/pdf-premium') },
      ],
    },
    {
      key: 'free-group',
      icon: <GiftOutlined />,
      label: 'Free Materials',
      children: [
        { key: '/admin/free-materials',        label: 'View Materials', icon: <FolderOpenOutlined />, onClick: go('/admin/free-materials') },
        { key: '/admin/free-material-upload',  label: 'Add Material',   icon: <UploadOutlined />,     onClick: go('/admin/free-material-upload') },
      ],
    },
    { key: '/admin/send-notification', icon: <SendOutlined />,   label: 'Notifications', onClick: go('/admin/send-notification') },
    { key: '/admin/blocks',            icon: <StopOutlined />,     label: 'Blocks',        onClick: go('/admin/blocks') },
    { key: '/admin/settings',          icon: <SettingOutlined />,  label: 'App Settings',  onClick: go('/admin/settings') },
    { key: '/admin/reports',           icon: <BarChartOutlined />, label: 'Reports',       onClick: go('/admin/reports') },
    {
      key: 'news-group',
      icon: <BellOutlined />,
      label: 'News',
      children: [
        { key: '/admin/news',    label: 'All News',  icon: <UnorderedListOutlined />, onClick: go('/admin/news') },
        { key: '/admin/addnews', label: 'Add News',  icon: <PlusOutlined />,          onClick: go('/admin/addnews') },
      ],
    },
    {
      key: 'banners-group',
      icon: <PictureOutlined />,
      label: 'Banners',
      children: [
        { key: '/admin/banners',    label: 'All Banners', icon: <UnorderedListOutlined />, onClick: go('/admin/banners') },
        { key: '/admin/addbanners', label: 'Add Banner',  icon: <PlusOutlined />,          onClick: go('/admin/addbanners') },
      ],
    },
  ];
}

/* ─── Route → selected key ──────────────────────────────────────────────────── */
function getSelectedKey(pathname) {
  if (pathname === '/admin/test-series')           return '/admin/test-series';
  if (pathname === '/admin/test-series/questions') return '/admin/test-series/questions';
  if (pathname === '/admin/test-series/purchases') return '/admin/test-series/purchases';
  if (pathname === '/admin/test-series/banners')   return '/admin/test-series/banners';
  if (pathname === '/admin/neet-plans')            return '/admin/neet-plans';
  if (pathname === '/admin/neet-plans/create')     return '/admin/neet-plans/create';
  if (pathname.startsWith('/admin/neet-plans/edit'))  return '/admin/neet-plans';
  if (pathname.startsWith('/admin/test-series/'))     return '/admin/test-series';
  return pathname;
}

function getOpenKey(pathname) {
  if (pathname.startsWith('/admin/test-series')) return 'test-series-group';
  if (['/admin/questions','/admin/upload','/admin/question','/admin/export'].some(p => pathname.startsWith(p))) return 'questions-group';
  if (['/admin/user','/admin/coupons','/admin/payments'].some(p => pathname.startsWith(p))) return 'users-group';
  if (pathname.startsWith('/admin/neet-plans')) return 'neet-group';
  if (['/admin/materials','/admin/material-upload','/admin/pdf-premium'].some(p => pathname.startsWith(p))) return 'materials-group';
  if (['/admin/free-materials','/admin/free-material-upload'].some(p => pathname.startsWith(p))) return 'free-group';
  if (['/admin/news','/admin/addnews'].some(p => pathname.startsWith(p))) return 'news-group';
  if (['/admin/banners','/admin/addbanners'].some(p => pathname.startsWith(p))) return 'banners-group';
  return null;
}

/* ─── Breadcrumb label map ──────────────────────────────────────────────────── */
const PAGE_LABELS = {
  '/admin/types':               { label: 'Types',              icon: <TagsOutlined /> },
  '/admin/questions':           { label: 'Questions',           icon: <QuestionCircleOutlined /> },
  '/admin/upload':              { label: 'Upload Questions',    icon: <UploadOutlined /> },
  '/admin/question':            { label: 'Add Question',        icon: <PlusOutlined /> },
  '/admin/export':              { label: 'Export Questions',    icon: <ExportOutlined /> },
  '/admin/user':                { label: 'Users',               icon: <UserOutlined /> },
  '/admin/coupons':             { label: 'Coupons',             icon: <GiftOutlined /> },
  '/admin/payments':            { label: 'Payments',            icon: <CreditCardOutlined /> },
  '/admin/neet-plans':          { label: 'NEET Plans',          icon: <CrownOutlined /> },
  '/admin/neet-plans/create':   { label: 'Create Plan',         icon: <PlusOutlined /> },
  '/admin/materials':           { label: 'Materials',           icon: <BookOutlined /> },
  '/admin/material-upload':     { label: 'Upload Material',     icon: <UploadOutlined /> },
  '/admin/pdf-premium':         { label: 'Premium Blocks',      icon: <StopOutlined /> },
  '/admin/free-materials':      { label: 'Free Materials',      icon: <GiftOutlined /> },
  '/admin/free-material-upload':{ label: 'Add Free Material',   icon: <UploadOutlined /> },
  '/admin/send-notification':   { label: 'Send Notification',   icon: <SendOutlined /> },
  '/admin/blocks':              { label: 'Blocks',              icon: <StopOutlined /> },
  '/admin/reports':             { label: 'Reports',             icon: <BarChartOutlined /> },
  '/admin/news':                { label: 'News',                icon: <BellOutlined /> },
  '/admin/addnews':             { label: 'Add News',            icon: <PlusOutlined /> },
  '/admin/banners':             { label: 'Banners',             icon: <PictureOutlined /> },
  '/admin/addbanners':          { label: 'Add Banner',          icon: <PlusOutlined /> },
  '/admin/test-series':         { label: 'Test Series — Packages',  icon: <SnippetsOutlined /> },
  '/admin/test-series/questions': { label: 'Test Series — Questions', icon: <QuestionCircleOutlined /> },
  '/admin/test-series/purchases':{ label: 'Test Series — Purchases', icon: <ShoppingOutlined /> },
  '/admin/test-series/banners':  { label: 'Test Series — Banners',  icon: <PictureOutlined /> },
  '/admin/test-series/create':  { label: 'Test Series — New Package', icon: <PlusOutlined /> },
};

function getPageInfo(pathname) {
  if (PAGE_LABELS[pathname]) return PAGE_LABELS[pathname];
  if (pathname.includes('/test-series/') && pathname.includes('/tests')) return { label: 'Test Series — Tests', icon: <SnippetsOutlined /> };
  if (pathname.includes('/test-series/') && pathname.includes('/edit'))  return { label: 'Test Series — Edit Package', icon: <SnippetsOutlined /> };
  if (pathname.includes('/neet-plans/edit')) return { label: 'Edit NEET Plan', icon: <CrownOutlined /> };
  if (pathname.includes('/user/'))           return { label: 'User Detail', icon: <UserOutlined /> };
  return { label: 'Dashboard', icon: <AppstoreOutlined /> };
}

/* ─── Main Layout ───────────────────────────────────────────────────────────── */
export default function AdminLayout() {
  useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const pathname    = location.pathname;
  const selectedKey = getSelectedKey(pathname);
  const openKey     = getOpenKey(pathname);
  const menuItems   = buildMenuItems(navigate);
  const pageInfo    = getPageInfo(pathname);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const userMenuItems = [
    { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, danger: true, onClick: handleLogout },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={248}
        collapsedWidth={68}
        style={{
          background: `linear-gradient(160deg, ${PRIMARY_DARK} 0%, ${PRIMARY_MID} 55%, ${PRIMARY} 100%)`,
          position: 'fixed',
          height: '100vh',
          left: 0, top: 0, bottom: 0,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '6px 0 32px rgba(61,26,92,0.28)',
          transition: 'width 0.22s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Decorative blur orb */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Logo area */}
        <div style={{
          padding: collapsed ? '18px 14px' : '18px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          flexShrink: 0, gap: 10,
          background: 'rgba(0,0,0,0.1)',
        }}>
          {collapsed ? (
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: 'rgba(255,255,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 17, letterSpacing: -1 }}>M</span>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12,
                  background: 'rgba(255,255,255,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ color: '#fff', fontWeight: 900, fontSize: 17, letterSpacing: -1 }}>M</span>
                </div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 14, lineHeight: 1.2, letterSpacing: 0.3 }}>MITOS</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase' }}>Learning</div>
                </div>
              </div>
              <Tag color="rgba(255,255,255,0.18)" style={{
                color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: 700,
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '1px 7px',
              }}>Admin</Tag>
            </>
          )}
        </div>

        {/* Scrollable menu */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingTop: 8, paddingBottom: 8 }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            defaultOpenKeys={openKey ? [openKey] : []}
            items={menuItems}
            theme="dark"
            style={{ background: 'transparent', border: 'none', padding: collapsed ? '0 4px' : '0 8px' }}
          />
        </div>

        {/* Collapse button */}
        <div style={{
          padding: '10px 12px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          flexShrink: 0,
          background: 'rgba(0,0,0,0.1)',
        }}>
          <Button
            type="text"
            block
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(c => !c)}
            style={{
              color: 'rgba(255,255,255,0.55)',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              height: 36,
              borderRadius: 8,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
          >
            {!collapsed && <span style={{ fontSize: 12, fontWeight: 500 }}>Collapse sidebar</span>}
          </Button>
        </div>
      </Sider>

      {/* ── Main area ───────────────────────────────────────────────────────── */}
      <Layout style={{
        marginLeft: collapsed ? 68 : 248,
        transition: 'margin-left 0.22s cubic-bezier(0.4,0,0.2,1)',
        background: '#f4f5f7',
      }}>

        {/* Top header */}
        <Header style={{
          background: '#fff',
          padding: '0 28px',
          height: 62,
          lineHeight: 'normal',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 99,
          boxShadow: '0 1px 0 #ebebeb, 0 4px 16px rgba(0,0,0,0.04)',
        }}>

          {/* Left: page title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: PRIMARY_LIGHT,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: PRIMARY, fontSize: 16,
            }}>
              {pageInfo.icon}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{pageInfo.label}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 400 }}>MITOS Admin Panel</div>
            </div>
          </div>

          {/* Right: actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

            <Tooltip title="Notifications">
              <Badge dot offset={[-4, 4]}>
                <Button
                  type="text"
                  shape="circle"
                  icon={<BellOutlined style={{ fontSize: 18, color: '#6B7280' }} />}
                  style={{ width: 38, height: 38 }}
                />
              </Badge>
            </Tooltip>

            <div style={{ width: 1, height: 24, background: '#F3F4F6', margin: '0 4px' }} />

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                cursor: 'pointer',
                padding: '5px 12px 5px 6px',
                borderRadius: 40,
                border: '1.5px solid #F3F4F6',
                background: '#FAFAFA',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#DDD6FE'; e.currentTarget.style.background = PRIMARY_LIGHT; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#F3F4F6'; e.currentTarget.style.background = '#FAFAFA'; }}
              >
                <Avatar
                  size={30}
                  style={{ background: `linear-gradient(135deg, ${PRIMARY_MID}, ${PRIMARY})`, flexShrink: 0 }}
                  icon={<UserOutlined />}
                />
                <div style={{ lineHeight: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Admin</div>
                  <div style={{ fontSize: 10, color: '#9CA3AF' }}>Administrator</div>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Page content */}
        <Content style={{
          padding: 28,
          minHeight: 'calc(100vh - 62px)',
          overflowY: 'auto',
          background: '#f4f5f7',
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
