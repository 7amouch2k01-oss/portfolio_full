import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const contactsFilePath = path.join(dataDir, 'contacts.json');

// Ensure data folder and contacts.json exist
function ensureStorage() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(contactsFilePath)) {
    fs.writeFileSync(contactsFilePath, JSON.stringify([], null, 2), 'utf-8');
  }
}

export function getContacts() {
  try {
    ensureStorage();
    const data = fs.readFileSync(contactsFilePath, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading contacts:', err);
    return [];
  }
}

export function saveContact({ name, email, subject, message }) {
  try {
    ensureStorage();
    const current = getContacts();
    const newContact = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };
    
    // Add new message to top of list
    const updated = [newContact, ...current];
    fs.writeFileSync(contactsFilePath, JSON.stringify(updated, null, 2), 'utf-8');
    return newContact;
  } catch (err) {
    console.error('Error saving contact:', err);
    return null;
  }
}

export function deleteContact(id) {
  try {
    ensureStorage();
    const current = getContacts();
    const filtered = current.filter((c) => c.id !== id);
    fs.writeFileSync(contactsFilePath, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error deleting contact:', err);
    return false;
  }
}
