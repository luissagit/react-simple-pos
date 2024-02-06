import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export async function handleLogin(payload: any) {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      payload?.email,
      payload?.password,
    );
    const { user } = userCredential;
    return user;
  } catch (err: any) {
    throw new Error(err);
  }
}
