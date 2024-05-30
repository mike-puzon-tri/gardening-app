import { Auth } from 'aws-amplify';

export default function PreLogin() {
  return (
    <div className="container mx-auto px-4 pt-6 ">
      <p className="mb-4">You have to login to use the DNA Example app. You can create your own account.</p>
      <button
        className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        onClick={() => Auth.federatedSignIn()}
      >
        Login
      </button>
    </div>
  );
}
