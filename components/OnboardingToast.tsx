'use client';

import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast"

export default function OnboardingToast() {
    const { toast } = useToast();

    useEffect(() => {
        toast({
            title: "Welcome to AIOFitness! 👋",
            description: "Let's set up your profile first so you can start using the app.",
            duration: 5000, // Shows for 5 seconds
        });
    }, []);

    return null;
}