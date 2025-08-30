// app/api/signup/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    // --- REFACTORED: Destructure new professional fields ---
    const {
      role,
      fullName,
      email,
      password,
      dateOfBirth,
      phone,
      practiceName, // New field
      npiNumber,    // New field
      medicalLicense,
      specialization,
    } = await request.json();

    // --- Basic Validation ---
    if (!email || !password || !fullName || !role || !practiceName || !medicalLicense || !specialization) {
      return NextResponse.json(
        { message: 'Missing required fields.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
        return NextResponse.json(
            { message: 'Password must be at least 8 characters long.' },
            { status: 400 }
        );
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('doctors');

    // --- Check if user already exists ---
    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists.' },
        { status: 409 } // 409 Conflict
      );
    }

    // --- Hash the password ---
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- REFACTORED: Create the user document with updated fields ---
    const newUserDocument = {
      role,
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      dateOfBirth,
      phone,
      practiceName,
      npiNumber: npiNumber || null, // Store as null if empty, since it's optional
      medicalLicense,
      specialization,
      isVerified: false, // Providers start as unverified
      createdAt: new Date(),
    };

    // --- Insert the new user into the database ---
    await usersCollection.insertOne(newUserDocument);

    return NextResponse.json(
      { message: 'User created successfully.' },
      { status: 201 } // 201 Created
    );
  } catch (error) {
    console.error('Signup API Error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}