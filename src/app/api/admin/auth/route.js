import { NextResponse } from 'next/server';

const ADMIN_SESSION_COOKIE = 'rozgar_admin_session';
const DEFAULT_ADMIN_PASSKEY = process.env.ADMIN_PASSWORD || 'RozgarPK@Admin2026!';
const DEFAULT_ADMIN_TOKEN = process.env.ADMIN_AUTH_TOKEN || 'rozgar_pk_sec_admin_auth_9921_valid';

export async function POST(request) {
  try {
    const body = await request.json();
    const { passkey } = body;

    if (!passkey || passkey !== DEFAULT_ADMIN_PASSKEY) {
      return NextResponse.json(
        { success: false, message: "Invalid administrator credentials." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful."
    });

    // Set secure HttpOnly session cookie
    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: DEFAULT_ADMIN_TOKEN,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Authentication service error." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Admin session terminated."
  });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });

  return response;
}
