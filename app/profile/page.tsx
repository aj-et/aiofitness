import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import ProfileForm from '@/components/cards/ProfileForm';

async function getUserProfile(userId: string) {
    try {
        const userProfile = await prisma.userprofile.findUnique({
            where: { userId },
        });
        return userProfile;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}

export default async function ProfilePage() {
    const { userId } = await auth();
    
    if (!userId) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-gray-600">Please sign in to view your profile</p>
            </div>
        );
    }

    const userProfile = await getUserProfile(userId);

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="text-gray-600">Update your personal information and preferences</p>
                </div>
                <ProfileForm initialData={userProfile} />
            </div>
        </main>
    );
}