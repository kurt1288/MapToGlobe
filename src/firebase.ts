import firebase from 'firebase/app';
import "firebase/analytics";
import "firebase/database";
import "firebase/auth";
import { customAlphabet } from 'nanoid';

const firebaseConfig = { /* Replace with your Firebase config object */ };

firebase.initializeApp(firebaseConfig);

const db = firebase.database().ref("saves");
const auth = firebase.auth();
export const analytics = firebase.analytics();

function GenerateKey(number = 8) {
    return customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', number)();
}

async function KeyExists(saveId: string) {
    const result = await db.child(saveId).child("data").once('value');
    return result.val() !== null;
}

async function Authenticate() {
    try {
        await auth.signInAnonymously();

        auth.onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                const isAnonymous = user.isAnonymous;
                const uid = user.uid;
            } else {
                // User is signed out.
                // ...
            }
        })
    }
    catch (error) {
        return;
    }
    return;
}

export async function Get(saveId: string) {
    try {
        await Authenticate();
        const result = await db.child(saveId).child("data").once('value');
        
        if (result.val() === null)
            return { success: false, message: `No save with id ${saveId} exists.` };
        
        await db.child(saveId).update({ lastGet: Date.now() });
        return { success: true, data: result.val() };
    }
    catch (ex) {
        return { success: false, message: `There was an error while getting the save: ${ex}`};
    }
}

export async function Save(data: any) {
    await Authenticate();
    const saveId = GenerateKey();
    const key = GenerateKey(10);
    let exists = await KeyExists(saveId);

    while (exists) {
        const saveId = GenerateKey();
        exists = await KeyExists(saveId);
    }

    await db.child(saveId).set({
        data: JSON.stringify(data),
        key: key,
        created: Date.now(),
        lastGet: Date.now(),
        lastUpdated: Date.now()
    });

    return { success: true, id: saveId, key: key };
}

export async function Update(data: any, item: any) {
    await Authenticate();

    await db.child(item.id).update({
        data: JSON.stringify(data),
        key: item.key,
        lastUpdated: Date.now()
    })

    return { success: true, message: "Save has been updated." };
}