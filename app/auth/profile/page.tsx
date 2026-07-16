'use client';

import { useRouter } from 'next/navigation';
import { Header, Footer, Button, Alert } from '@/components';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
          <div className="h-6 w-48 mb-4 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-5 w-64 mb-2 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-5 w-40 rounded-full bg-gray-200 animate-pulse" />
        </div>
      </main>
    );
  }

  return (
    <>
      <Header cartCount={0} onCartClick={() => router.push('/cart')} />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {isAuthenticated && user ? (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr]">
              <section className="rounded-3xl bg-white p-8 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-blue-600">Account</p>
                    <h1 className="mt-3 text-3xl font-semibold text-gray-900">Profile</h1>
                  </div>
                  <Button variant="secondary" onClick={() => router.push('/orders')}>
                    View Orders
                  </Button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-[0.16em] mb-3">Name</h2>
                    <p className="text-lg font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-[0.16em] mb-3">Email</h2>
                    <p className="text-lg font-medium text-gray-900">{user.email}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-[0.16em] mb-3">Role</h2>
                    <p className="text-lg font-medium text-gray-900 capitalize">{user.role}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-[0.16em] mb-3">Status</h2>
                    <p className="text-lg font-medium text-gray-900">Verified customer</p>
                  </div>
                </div>

                <div className="mt-8 rounded-3xl bg-blue-50 p-6 border border-blue-100">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-blue-700">💡</div>
                    <div>
                      <p className="font-semibold text-blue-900">Keep your account secure</p>
                      <p className="text-sm leading-6 text-blue-800">
                        Manage orders, saved information, and payment preferences from this dashboard. Update your password and contact details as needed.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <aside className="rounded-3xl bg-white p-8 shadow-sm border border-gray-200">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Quick actions</h2>
                    <p className="text-sm text-gray-500">Access your order history, account security, and support.</p>
                  </div>

                  <div className="grid gap-4">
                    <Button fullWidth onClick={() => router.push('/orders')}>
                      Manage orders
                    </Button>
                    <Button fullWidth variant="secondary" onClick={handleSignOut}>
                      Sign out
                    </Button>
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-10 shadow-sm border border-gray-200 text-center">
              <Alert type="error">
                You need to sign in to access your profile.{' '}
                <button onClick={() => router.push('/auth/login')} className="font-semibold text-blue-600 hover:underline">
                  Sign in now
                </button>
              </Alert>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
