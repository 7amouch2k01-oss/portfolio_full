import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getContactsCollection } from '../../lib/mongodb';

const ADMIN_PASSWORD = process.env.ADMIN_SECRET_PASSWORD || 'amine2026';

function isAuthorized(request) {
  const auth = request.headers.get('authorization');
  if (auth && auth.startsWith('Bearer ')) {
    return auth.substring(7) === ADMIN_PASSWORD;
  }
  const url = new URL(request.url);
  return url.searchParams.get('pwd') === ADMIN_PASSWORD;
}

// ── POST: Public — submit a contact message ──────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // 1. Save to MongoDB
    const collection = await getContactsCollection();
    const doc = {
      name,
      email,
      subject,
      message,
      createdAt: new Date(),
      read: false,
    };
    await collection.insertOne(doc);

    // 2. Forward via Web3Forms if configured (best-effort, never block submission)
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (accessKey) {
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: accessKey,
            name,
            email,
            subject: `[Portfolio Contact] ${subject}`,
            message,
            to_email: process.env.CONTACT_EMAIL || 'contact@marzeigui.dev',
          }),
        });
      } catch (emailErr) {
        console.warn('Web3Forms dispatch warning (message safely stored in DB):', emailErr.message);
      }
    }

    return NextResponse.json(
      { success: true, message: "Your message has been sent! I'll get back to you within 24 hours." },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact POST error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// ── GET: Admin — fetch all contacts (password-protected) ─────────────────────
export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const collection = await getContactsCollection();
    const contacts = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Convert ObjectId to string for JSON serialization
    const serialized = contacts.map((c) => ({
      ...c,
      id: c._id.toString(),
      _id: undefined,
      createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
    }));

    return NextResponse.json({ success: true, contacts: serialized }, { status: 200 });
  } catch (error) {
    console.error('Contact GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts.' }, { status: 500 });
  }
}

// ── DELETE: Admin — delete a contact by ID (password-protected) ──────────────
export async function DELETE(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Contact ID is required.' }, { status: 400 });
    }

    const collection = await getContactsCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Contact not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Contact DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete contact.' }, { status: 500 });
  }
}
