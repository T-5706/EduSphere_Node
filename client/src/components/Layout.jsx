import { useRef, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, uploadUrl } from '../api';

const links = [['/','Dashboard','⌂'],['/todo','To-do','✓'],['/timer','Focus timer','◷']];

export default function Layout() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInput = useRef(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [pictureMessage, setPictureMessage] = useState('');
  const [pictureError, setPictureError] = useState('');

  function signOut() { logout(); navigate('/login'); }

  function avatarContent() {
    if (user?.profilePicture) {
      return <img className="avatar-image" src={uploadUrl(user.profilePicture)} alt="Profile" />;
    }
    return (user?.firstName?.[0] || 'S').toUpperCase();
  }

  async function changeProfilePicture(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setPictureMessage('');
    setPictureError('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setPictureError('Choose a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPictureError('Image must be 5 MB or smaller.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);
    setUploadingPicture(true);
    try {
      const result = await api('/auth/profile-picture', { method: 'POST', body: formData });
      setUser(result.user);
      localStorage.setItem('edusphere_user', JSON.stringify(result.user));
      setPictureMessage('Profile picture updated.');
    } catch (error) {
      setPictureError(error.message);
    } finally {
      setUploadingPicture(false);
    }
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <NavLink className="brand" to="/"><span className="brand-mark">E</span><span>EduSphere</span></NavLink>
      <div className="workspace-chip">
        <button className="avatar avatar-button" type="button" onClick={() => fileInput.current?.click()} title="Change profile picture" aria-label="Change profile picture" disabled={uploadingPicture}>{avatarContent()}</button>
        <span>{user?.firstName || 'Student'}'s space<small>{user?.program || 'Student workspace'}</small><small className="avatar-hint">{uploadingPicture ? 'Uploading picture…' : 'Click photo to update'}</small></span>
        <input ref={fileInput} className="visually-hidden" type="file" accept="image/png,image/jpeg,image/webp" onChange={changeProfilePicture} />
      </div>
      {pictureError && <p className="profile-picture-message error-text">{pictureError}</p>}
      {pictureMessage && <p className="profile-picture-message success-text">{pictureMessage}</p>}
      <p className="nav-label">WORKSPACE</p>
      <nav className="nav-list">{links.map(([to,label,icon])=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>`nav-item ${isActive?'is-active':''}`}><span>{icon}</span>{label}</NavLink>)}</nav>
      <div className="sidebar-bottom">
        <div className="help-card"><span>✦</span><div><b>Study a little daily</b><small>Small steps add up.</small></div></div>
        <button className="profile-link" onClick={signOut}>
          <span className="avatar">{avatarContent()}</span>
          <span><b>{user?.firstName} {user?.lastName}</b><small>Sign out</small></span><span>↗</span>
        </button>
      </div>
    </aside>
    <main className="main-content"><header className="mobile-top"><span className="brand-mark">E</span><b>EduSphere</b><button className="avatar avatar-button mobile-avatar-button" type="button" onClick={() => fileInput.current?.click()} title="Change profile picture" aria-label="Change profile picture" disabled={uploadingPicture}>{avatarContent()}</button><button className="btn btn-quiet" onClick={signOut}>Sign out</button></header><Outlet /></main>
  </div>;
}
