import { NextResponse } from 'next/server';

// In-memory / server-logged contact message handler
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, department } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const contactEntry = {
      id: `msg-${Date.now()}`,
      receivedAt: new Date().toISOString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject || 'General Inquiry',
      department: department || 'Support',
      message: message.trim(),
      status: 'RECEIVED'
    };

    console.log('[Tainaati Contact Inbox] New Message Received:', contactEntry);

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out. Your message has been routed to the Tainaati support team.',
      ticketId: contactEntry.id
    });
  } catch (error) {
    console.error('[Tainaati Contact Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing contact submission.' },
      { status: 500 }
    );
  }
}
