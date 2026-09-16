'use client';

import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CloseIcon from '@mui/icons-material/Close';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LogoutIcon from '@mui/icons-material/Logout';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { ORANGE, ORANGE_GRADIENT, BG_PAPER, BG_ELEVATED, BORDER_SUBTLE, BORDER_ORANGE } from '../theme';

export default function SecretDashboardModal({ open, onClose }) {
  const [step, setStep] = useState('auth'); // 'auth' | 'dashboard'
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [savedPassword, setSavedPassword] = useState('');

  // Fetch contacts from server with stored password
  const fetchContacts = async (pwd) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contact?pwd=${encodeURIComponent(pwd)}`, {
        headers: {
          Authorization: `Bearer ${pwd}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      setContacts(data.contacts || []);
      setSavedPassword(pwd);
      setStep('dashboard');
      setAuthError('');
    } catch (err) {
      setAuthError(err.message || 'Incorrect security password');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setAuthError('Please enter the security password');
      return;
    }
    fetchContacts(password);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this contact message?')) return;
    try {
      const res = await fetch(`/api/contact?pwd=${encodeURIComponent(savedPassword)}&id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${savedPassword}`,
        },
      });
      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== id));
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete contact:', err);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClose = () => {
    setPassword('');
    setAuthError('');
    setSelectedMessage(null);
    onClose();
  };

  const handleLogout = () => {
    setStep('auth');
    setPassword('');
    setSavedPassword('');
    setSelectedMessage(null);
    setContacts([]);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={step === 'dashboard' ? 'lg' : 'xs'}
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: BG_PAPER,
            color: 'text.primary',
            border: `1px solid ${BORDER_ORANGE}`,
            borderRadius: 2,
            boxShadow: '0 24px 70px rgba(0,0,0,0.85)',
            position: 'relative',
            minHeight: step === 'dashboard' ? 620 : 360,
          },
        },
      }}
    >
      {/* Top Close Button */}
      <IconButton
        onClick={handleClose}
        sx={{
          position: 'absolute',
          top: 14,
          right: 14,
          color: 'text.secondary',
          '&:hover': { color: ORANGE },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <DialogContent sx={{ p: { xs: 3, md: 4 } }}>
        {/* STEP 1: PASSWORD AUTH */}
        {step === 'auth' && (
          <Box
            component="form"
            onSubmit={handleAuthSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              pt: 2,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: 'rgba(232,114,21,0.1)',
                border: `1px solid ${BORDER_ORANGE}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <LockOutlinedIcon sx={{ color: ORANGE, fontSize: 30 }} />
            </Box>

            <Typography
              variant="overline"
              sx={{
                color: ORANGE,
                fontFamily: '"Roboto Mono", monospace',
                letterSpacing: '0.2em',
                fontSize: '0.68rem',
              }}
            >
              RESTRICTED ACCESS
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.01em' }}>
              Secret Contacts Portal
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, fontSize: '0.85rem' }}>
              Enter your administrative passkey to unlock the private inquiries dashboard.
            </Typography>

            {authError && (
              <Alert severity="error" sx={{ width: '100%', mb: 2.5, fontSize: '0.8rem' }}>
                {authError}
              </Alert>
            )}

            <TextField
              fullWidth
              autoFocus
              type="password"
              label="Admin Passkey"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                background: ORANGE_GRADIENT,
                color: '#fff',
                fontWeight: 800,
                letterSpacing: '0.1em',
                py: 1.4,
                boxShadow: `0 0 20px rgba(232,114,21,0.35)`,
                '&:hover': { boxShadow: `0 0 30px rgba(232,114,21,0.55)` },
              }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'UNLOCK DASHBOARD'}
            </Button>

            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 2, fontSize: '0.7rem' }}>
              Hint: Default password is <strong>amine2026</strong>
            </Typography>
          </Box>
        )}

        {/* STEP 2: SECRET CONTACTS DASHBOARD */}
        {step === 'dashboard' && (
          <Box>
            {/* Header Toolbar */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                borderBottom: `1px solid ${BORDER_SUBTLE}`,
                pb: 2.5,
                mb: 3,
                gap: 2,
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                  <Box sx={{ width: 10, height: 10, bgcolor: '#10B981', borderRadius: '50%' }} />
                  <Typography
                    variant="overline"
                    sx={{
                      color: '#10B981',
                      fontFamily: '"Roboto Mono", monospace',
                      letterSpacing: '0.15em',
                      fontWeight: 800,
                      fontSize: '0.7rem',
                    }}
                  >
                    CONFIDENTIAL INBOX
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, fontSize: '1.6rem' }}>
                  Received Inquiries &amp; Leads
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                  Total contacts stored: <strong>{contacts.length}</strong>
                </Typography>
              </Box>

              <Stack direction="row" spacing={1.5}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={() => fetchContacts(savedPassword)}
                  disabled={loading}
                  sx={{
                    borderColor: BORDER_SUBTLE,
                    color: 'text.secondary',
                    '&:hover': { borderColor: ORANGE, color: ORANGE },
                  }}
                >
                  Refresh
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{ borderColor: 'rgba(239,68,68,0.3)', color: '#EF4444' }}
                >
                  Lock Portal
                </Button>
              </Stack>
            </Box>

            {/* Content Area: Table / Empty State */}
            {contacts.length === 0 ? (
              <Box
                sx={{
                  py: 10,
                  textAlign: 'center',
                  bgcolor: BG_ELEVATED,
                  border: `1px dashed ${BORDER_SUBTLE}`,
                  borderRadius: 2,
                }}
              >
                <EmailIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  No Inquiries Received Yet
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 400, mx: 'auto' }}>
                  Whenever a visitor sends a message from your Contact section, it will appear here in real-time.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: selectedMessage ? '1.2fr 1fr' : '1fr' }, gap: 3 }}>
                {/* Messages List Table */}
                <TableContainer
                  component={Paper}
                  sx={{
                    bgcolor: BG_ELEVATED,
                    border: `1px solid ${BORDER_SUBTLE}`,
                    borderRadius: 2,
                    maxHeight: 480,
                  }}
                >
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ bgcolor: '#161616', color: ORANGE, fontWeight: 700, fontSize: '0.72rem' }}>
                          DATE
                        </TableCell>
                        <TableCell sx={{ bgcolor: '#161616', color: ORANGE, fontWeight: 700, fontSize: '0.72rem' }}>
                          SENDER
                        </TableCell>
                        <TableCell sx={{ bgcolor: '#161616', color: ORANGE, fontWeight: 700, fontSize: '0.72rem' }}>
                          SUBJECT
                        </TableCell>
                        <TableCell sx={{ bgcolor: '#161616', color: ORANGE, fontWeight: 700, fontSize: '0.72rem' }} align="right">
                          ACTIONS
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {contacts.map((c) => {
                        const isSelected = selectedMessage && selectedMessage.id === c.id;
                        const dateFormatted = new Date(c.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        });
                        return (
                          <TableRow
                            key={c.id}
                            hover
                            onClick={() => setSelectedMessage(c)}
                            sx={{
                              cursor: 'pointer',
                              bgcolor: isSelected ? 'rgba(232,114,21,0.08)' : 'inherit',
                              '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
                            }}
                          >
                            <TableCell sx={{ color: 'text.secondary', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                              {dateFormatted}
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#fff' }}>
                                {c.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                                {c.email}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ color: 'text.primary', fontSize: '0.82rem', maxWidth: 220 }}>
                              <Typography noWrap sx={{ fontSize: '0.82rem' }}>
                                {c.subject}
                              </Typography>
                            </TableCell>
                            <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(c.id)}
                                sx={{ color: 'text.secondary', '&:hover': { color: '#EF4444' } }}
                              >
                                <DeleteOutlinedIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Message Detail Card */}
                {selectedMessage && (
                  <Box
                    sx={{
                      bgcolor: BG_ELEVATED,
                      border: `1px solid ${BORDER_ORANGE}`,
                      borderRadius: 2,
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      maxHeight: 480,
                      overflowY: 'auto',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Chip
                          label="MESSAGE DETAILS"
                          size="small"
                          sx={{
                            bgcolor: 'rgba(232,114,21,0.12)',
                            color: ORANGE,
                            border: `1px solid ${BORDER_ORANGE}`,
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            mb: 1,
                          }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem' }}>
                          {selectedMessage.subject}
                        </Typography>
                      </Box>
                      <IconButton size="small" onClick={() => setSelectedMessage(null)}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Sender Info */}
                    <Stack spacing={1.2} mb={2.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ color: ORANGE, fontSize: 18 }} />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {selectedMessage.name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon sx={{ color: ORANGE, fontSize: 18 }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {selectedMessage.email}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleCopy(selectedMessage.email, selectedMessage.id)}
                          sx={{ color: 'text.secondary', p: 0.5 }}
                        >
                          {copiedId === selectedMessage.id ? (
                            <CheckIcon sx={{ fontSize: 14, color: '#10B981' }} />
                          ) : (
                            <ContentCopyIcon sx={{ fontSize: 14 }} />
                          )}
                        </IconButton>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ScheduleIcon sx={{ color: ORANGE, fontSize: 18 }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {new Date(selectedMessage.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    {/* Full Message Body */}
                    <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                      MESSAGE CONTENT
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'rgba(0,0,0,0.35)',
                        border: `1px solid ${BORDER_SUBTLE}`,
                        borderRadius: 1,
                        flexGrow: 1,
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'inherit',
                        fontSize: '0.88rem',
                        lineHeight: 1.7,
                        color: 'text.primary',
                        mb: 2.5,
                      }}
                    >
                      {selectedMessage.message}
                    </Box>

                    {/* Action Bar */}
                    <Stack direction="row" spacing={1.5}>
                      <Button
                        variant="contained"
                        component="a"
                        href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                        startIcon={<EmailIcon />}
                        sx={{
                          background: ORANGE_GRADIENT,
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                        }}
                      >
                        Reply via Email
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteOutlinedIcon />}
                        onClick={() => handleDelete(selectedMessage.id)}
                        sx={{ fontSize: '0.75rem' }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
