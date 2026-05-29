import { LoginForm } from "./login-form";
import Image from "next/image";
import Link from "next/link";
export default function LoginPage() {
  return (
    <div className="relative min-h-svh">
      {/* Background with blur effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/hero_webp.webp')`,
        }}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 self-center font-medium text-white"
          >
            <Image
              src="/logo.png"
              alt="Kevasiya"
              width={100}
              height={100}
              className="mx-auto w-60 mr-5"
            />
          </Link>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
