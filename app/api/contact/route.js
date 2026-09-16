import { NextResponse } from 'next/server';
import { saveContact, getContacts, deleteContact } from '../../lib/contactsStore';

const ADMIN_PASSWORD = process.env.ADMIN_SECRET_PASSWORD || 'amine2026';

// Helper to verify admin password
function isAuthorized(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token === ADMIN_PASSWORD) return true;
  }
  const url = new URL(request.url);
  const pwdParam = url.searchParams.get('pwd');
  return pwdParam === ADMIN_PASSWORD;
}

// POST: Public submission of contact inquiries
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields (name, email, subject, message) are required.' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // 1. Save to secret contacts store
    const savedContact = saveContact({ name, email, subject, message });

    // 2. Dispatch to Web3Forms if configured
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY || process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    const recipientEmail = process.env.CONTACT_EMAIL || 'contact@marzeigui.dev';

    if (accessKey) {
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: accessKey,
            name,
            email,
            subject: `[Portfolio Contact] ${subject}`,
            message,
            to_email: recipientEmail,
          }),
        });
      } catch (dispatchErr) {
        console.warn('Web3Forms dispatch warning (message safely stored locally):', dispatchErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully! I will get back to you within 24 hours.',
        contact: savedContact,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error handling contact submission:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while sending your message. Please try again later.' },
      { status: 500 }
    );
  }
}

// GET: Retrieve all contacts for secret dashboard (protected)
export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized. Invalid security key.' }, { status: 401 });
  }

  const contacts = getContacts();
  return NextResponse.json({ success: true, contacts }, { status: 200 });
}

// DELETE: Remove a contact from dashboard (protected)
export async function DELETE(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized. Invalid security key.' }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
  }

  const success = deleteContact(id);
  return NextResponse.json({ success }, { status: success ? 200 : 500 });
}
