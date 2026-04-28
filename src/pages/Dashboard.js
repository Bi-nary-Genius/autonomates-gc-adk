import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import PhotoUploader from '../components/PhotoUploader';
import Card from '../components/Card';
import EditModal from '../components/EditModal';
import RegenerateModal from '../components/RegenerateModal';
import GuestBanner from '../components/GuestBanner';
import './Dashboard.css';
import API_BASE from '../config';

function Dashboard({ user, openLoginModal }) {
  const [scenarios, setScenarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [playingId, setPlayingId]             = useState(null);
  const [isRegenModalOpen, setIsRegenModalOpen] = useState(false);
  const [regenScenario, setRegenScenario]       = useState(null);
  const [searchQuery, setSearchQuery]           = useState('');

  // Guest mode: prompt shown once before first edit/regen action
  // null = no pending action; { callback: fn, label: string } = waiting for user choice
  const [guestPrompt, setGuestPrompt]         = useState(null);
  const [guestPromptSeen, setGuestPromptSeen] = useState(false);

  // Ref tracks the active utterance so async onend/onerror from a cancelled
  // utterance cannot overwrite the playingId of a newly started one.
  const utteranceRef = useRef(null);

  // Extracted so the retry button can call it directly.
  const fetchScenarios = useCallback(async () => {
    if (!user) {
      setScenarios([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setFetchError(false);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch(`${API_BASE}/photo_upload/`, {
        headers: { 'id-token': idToken },
      });
      if (!res.ok) throw new Error('Failed to fetch scenarios');
      setScenarios(await res.json());
    } catch (err) {
      console.error('Error fetching scenarios:', err);
      setFetchError(true);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchScenarios();
  }, [fetchScenarios]);

  const handleDelete = async (scenarioIdToDelete) => {
    if (!window.confirm('Are you sure you want to permanently delete this scenario?')) return;
    if (!user) return alert('You must be logged in to delete scenarios.');
    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`${API_BASE}/photo_upload/${scenarioIdToDelete}`, {
        method: 'DELETE',
        headers: { 'id-token': idToken },
      });
      if (!response.ok) throw new Error('Failed to delete scenario.');
      setScenarios((prev) => prev.filter((s) => s.id !== scenarioIdToDelete));
    } catch (error) {
      console.error('Error deleting scenario:', error);
      alert('There was an error deleting the scenario.');
    }
  };

  const handleNewScenario = (newScenario) =>
    setScenarios((prev) => [newScenario, ...prev]);

  // Audio via browser speechSynthesis — no backend or billing required locally.
  // To switch to the backend TTS path in production, replace this function body
  // with a fetch to POST /tts/generate and play the returned audioUrl via new Audio(url).
  const handlePlayAudio = useCallback((scenario) => {
    if (!window.speechSynthesis) return;

    // Clicking the active card again stops it.
    if (playingId === scenario.id) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
      setPlayingId(null);
      return;
    }

    // Stop whatever is currently playing.
    window.speechSynthesis.cancel();
    utteranceRef.current = null;

    const text = scenario.story || scenario.prompt || scenario.title;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';

    // Only clear state if this utterance is still the active one —
    // prevents the cancelled old utterance's onend from wiping the new playingId.
    const clearIfCurrent = () => {
      if (utteranceRef.current === utterance) {
        utteranceRef.current = null;
        setPlayingId(null);
      }
    };
    utterance.onend = clearIfCurrent;
    utterance.onerror = clearIfCurrent;

    utteranceRef.current = utterance;
    setPlayingId(scenario.id);
    window.speechSynthesis.speak(utterance);
  }, [playingId]);

  // Gate helper — shows a one-time "sign in to save" prompt for guest users
  // before running an action that produces persistent data.
  const withGuestGate = (label, callback) => {
    if (user?.isAnonymous && !guestPromptSeen) {
      setGuestPrompt({ label, callback });
    } else {
      callback();
    }
  };

  const handleOpenRegenModal = (scenario) => {
    withGuestGate('Regenerate story', () => {
      setRegenScenario(scenario);
      setIsRegenModalOpen(true);
    });
  };

  const handleRegenerated = (updated) => {
    setScenarios(prev => prev.map(s => s.id === updated.id ? updated : s));
  };
  // Attach user + apiBase so RegenerateModal can make the fetch call.
  handleRegenerated.__meta__ = { user, apiBase: API_BASE };

  const handleOpenEditModal = (scenario) => {
    withGuestGate('Edit scenario', () => {
      setCurrentScenario(scenario);
      setIsModalOpen(true);
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentScenario(null);
  };

  // Throws on failure — EditModal owns the try/catch and UI feedback.
  const handleSaveChanges = async (updatedScenario) => {
    console.log('[Dashboard] handleSaveChanges — id:', updatedScenario.id, 'tone:', updatedScenario.tone, 'voiceStyle:', updatedScenario.voiceStyle);
    const idToken = await user.getIdToken();
    const response = await fetch(`${API_BASE}/photo_upload/${updatedScenario.id}`, {
      method: 'PUT',
      headers: { 'id-token': idToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: updatedScenario.title,
        prompt: updatedScenario.prompt,
        imageUrls: updatedScenario.imageUrls,
        tone: updatedScenario.tone,
        voiceStyle: updatedScenario.voiceStyle,
      }),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error('[Dashboard] PUT failed:', response.status, detail);
      throw new Error(`Save failed (${response.status})${detail ? ': ' + detail : ''}`);
    }
    // Use server-confirmed data so new image URLs are reflected immediately.
    const saved = await response.json();
    console.log('[Dashboard] PUT succeeded — saved:', { id: saved.id, tone: saved.tone, voiceStyle: saved.voiceStyle });
    setScenarios((prev) =>
      prev.map((s) => (s.id === updatedScenario.id ? { ...s, ...saved } : s))
    );
  };

  const handleSaveAndRegenerate = async (updatedScenario) => {
    console.log('[Dashboard] handleSaveAndRegenerate — id:', updatedScenario.id, 'tone:', updatedScenario.tone);
    const idToken = await user.getIdToken();
    const putRes = await fetch(`${API_BASE}/photo_upload/${updatedScenario.id}`, {
      method: 'PUT',
      headers: { 'id-token': idToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: updatedScenario.title,
        prompt: updatedScenario.prompt,
        imageUrls: updatedScenario.imageUrls,
        tone: updatedScenario.tone,
        voiceStyle: updatedScenario.voiceStyle,
      }),
    });
    if (!putRes.ok) {
      const detail = await putRes.text().catch(() => '');
      console.error('[Dashboard] PUT (save) failed:', putRes.status, detail);
      throw new Error(`Save failed (${putRes.status})${detail ? ': ' + detail : ''}`);
    }

    const formData = new FormData();
    formData.append('prompt', updatedScenario.prompt);
    const regenRes = await fetch(`${API_BASE}/photo_upload/${updatedScenario.id}/regenerate`, {
      method: 'POST',
      headers: { 'id-token': idToken },
      body: formData,
    });
    if (!regenRes.ok) {
      const detail = await regenRes.text().catch(() => '');
      console.error('[Dashboard] POST (regenerate) failed:', regenRes.status, detail);
      throw new Error(`Story regeneration failed (${regenRes.status})${detail ? ': ' + detail : ''}`);
    }
    const regenerated = await regenRes.json();
    console.log('[Dashboard] Regeneration succeeded — id:', regenerated.id);
    setScenarios((prev) =>
      prev.map((s) => (s.id === regenerated.id ? { ...s, ...regenerated } : s))
    );
  };

  const renderScenarios = () => {
    if (isLoading) {
      return (
        <div className="state-message">
          <div className="loading-spinner" />
          <p>Loading scenarios…</p>
        </div>
      );
    }
    if (fetchError) {
      return (
        <div className="state-message error">
          <p>What if your scenarios are hiding somewhere we can't reach right now?</p>
          <button className="retry-button" onClick={fetchScenarios}>
            Try again
          </button>
        </div>
      );
    }
    if (scenarios.length === 0) {
      return (
        <div className="empty-state">
          <p className="empty-state-prompt">"What if one decision changed everything?"</p>
          <p className="empty-state-sub">
            Start with a question. Upload a photo of a place, a person, or a moment — then let the AI turn it into a story.
          </p>
          <p className="empty-state-hint">Use the panel on the left to build your first scenario.</p>
        </div>
      );
    }

    const q = searchQuery.trim().toLowerCase();
    const filtered = q
      ? scenarios.filter(
          (s) =>
            s.title?.toLowerCase().includes(q) ||
            s.prompt?.toLowerCase().includes(q)
        )
      : scenarios;

    return (
      <>
        <div className="scenarios-search">
          <input
            type="text"
            className="scenarios-search-input"
            placeholder="Search by title or prompt…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {q && (
            <span className="scenarios-search-count">
              {filtered.length} of {scenarios.length}
            </span>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="state-message">
            <p>No scenarios match "{searchQuery}".</p>
          </div>
        ) : (
          <div className="card-grid">
            {filtered.map((s) => (
              <Card
                key={s.id}
                title={s.title}
                description={
                  s.prompt ||
                  (s.ai_labels?.length
                    ? `AI tags: ${s.ai_labels.join(', ')}`
                    : 'No description provided.')
                }
                imageUrls={s.imageUrls || []}
                story={s.story}
                segments={s.segments}
                voiceStyle={s.voiceStyle}
                tone={s.tone}
                onDelete={() => handleDelete(s.id)}
                onPlay={() => handlePlayAudio(s)}
                onEdit={() => handleOpenEditModal(s)}
                onRegenerate={() => handleOpenRegenModal(s)}
                isPlaying={playingId === s.id}
              />
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main-content">
        <p className="page-eyebrow">WhatIf.AI</p>

        {user?.isAnonymous && (
          <GuestBanner onSignIn={openLoginModal} />
        )}

        {/* One-time "sign in to save" prompt before edit/regen for guests */}
        {guestPrompt && (
          <div className="guest-prompt-overlay" onClick={() => setGuestPrompt(null)}>
            <div className="guest-prompt-card" onClick={(e) => e.stopPropagation()}>
              <p className="guest-prompt-heading">🔐 Sign in to save permanently</p>
              <p className="guest-prompt-body">
                <strong>{guestPrompt.label}</strong> will work in guest mode, but your changes
                are tied to this session and cannot be recovered later.
              </p>
              <div className="guest-prompt-actions">
                <button
                  className="guest-prompt-signin"
                  onClick={() => { setGuestPrompt(null); openLoginModal(); }}
                >
                  Sign In
                </button>
                <button
                  className="guest-prompt-continue"
                  onClick={() => {
                    setGuestPromptSeen(true);
                    guestPrompt.callback();
                    setGuestPrompt(null);
                  }}
                >
                  Continue as Guest
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="dashboard-panels">
          <div className="scenario-creator-panel glass-panel">
            <h3 className="panel-heading">Build a New Scenario</h3>
            <PhotoUploader user={user} onScenarioCreated={handleNewScenario} />
          </div>

          <div className="info-panel">
            <h2 className="panel-heading">My Scenarios</h2>
            {renderScenarios()}
          </div>
        </div>
      </main>

      <EditModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        scenario={currentScenario}
        onSave={handleSaveChanges}
        onSaveAndRegenerate={handleSaveAndRegenerate}
        user={user}
      />

      <RegenerateModal
        isOpen={isRegenModalOpen}
        onRequestClose={() => setIsRegenModalOpen(false)}
        scenario={regenScenario}
        onRegenerated={handleRegenerated}
      />
    </div>
  );
}

export default Dashboard;
