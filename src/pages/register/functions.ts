import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

export async function handleRegister(payload: any) {
  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, payload?.email, payload?.password);
    const { user } = userCredential;
    return user;
  } catch (err: any) {
    throw new Error(err);
  }
}
