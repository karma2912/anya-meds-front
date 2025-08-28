// app/api/login/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // --- Basic Validation ---
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // --- Find the user by email ---
    const user = await usersCollection.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 } // 401 Unauthorized
      );
    }

    // --- Compare the provided password with the stored hashed password ---
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      );
    }
    
    // --- IMPORTANT: Session/Token Logic would go here ---
    // In a real application, you would create a JWT (JSON Web Token) or a session
    // to keep the user logged in. For now, we'll just return a success message.

    // --- Return a success response (excluding the password) ---
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { message: 'Login successful.', user: userWithoutPassword },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}