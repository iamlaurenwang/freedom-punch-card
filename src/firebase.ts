import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, doc, setDoc } from 'firebase/firestore'
import { firebaseConfig } from '@/firebase/firebaseConfig'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
const db = getFirestore(app)


/** Auth Helpers */
export async function signInWithGoogle(){
    const result = await signInWithPopup(auth, provider)

    // create or update user document
    const u = result.user
    await setDoc(doc(db, 'users', u.uid), {
        uid: u.uid,
        email: u.email || null,
        displayName: u.displayName || null,
        photoURL: u.photoURL || null,
        lastSignIn: serverTimestamp()
    }, {merge: true})

    return result.user
}

export function signOut() { return firebaseSignOut(auth)}
export function onAuthChange(cb) { return onAuthStateChanged(auth, cb)}

/** Firestore: points */

export async function addPoint(userId: string, reason?: string){
    if(!userId) throw new Error('userId required')
        const pointsRef = collection(db, 'points')
        const docRef = await addDoc(pointsRef, {
            userId,
            reason: reason || '',
            createAt: serverTimestamp()
        })

    return docRef.id

}

export function subscribeToUserPoints(userId: string, onUpdate: (ids: { id: string; }[]) => void){
    const pointsRef = collection(db, 'points')
    const q = query(pointsRef, where('userId', '==', userId), orderBy('createAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(d => ({id: d.id, ...d.data()}))
        onUpdate(items)
    })
}

export { auth, db}