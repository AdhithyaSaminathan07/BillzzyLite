import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const { pin } = await request.json();

        if (!pin) {
            return NextResponse.json({ message: 'PIN is required' }, { status: 400 });
        }

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (user.pin === pin) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, message: 'Incorrect PIN' }, { status: 401 });
        }
    } catch (error) {
        console.error('PIN Verification Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
