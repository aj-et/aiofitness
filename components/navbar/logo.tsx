import Link from "next/link";

export function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-600">AIOfitness</span>
        </Link>
    );
}