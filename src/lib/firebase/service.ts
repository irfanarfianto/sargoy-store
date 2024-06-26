import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore'
import app from './init'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

const firestore = getFirestore(app);

const storage = getStorage(app);

export async function retrieveData(collectionName: string) {
   const snapshot = await getDocs(collection(firestore, collectionName));
   const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

   return data;
}

export async function retrieveDataById(collectionName: string, id: string) {
const snapshot = await getDoc(doc(firestore, collectionName, id));
   const data = snapshot.data();
   return data;
}

export async function retrieveDataByField(collectionName:string, field: string, value: string) {
   const q = query(
      collection(firestore, collectionName),
      where(field, '==', value)
   );

   const snapshot = await getDocs(q);
   const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

   return data;
}

export async function addData(collectionName:string, data:any, callback: Function) {
      await addDoc(collection(firestore, collectionName), data)
         .then((res) => {
            callback(true, res);
         })
         .catch((error) => {
            callback(error);
         });
}

export async function updateData(collectionName: string, id: string, data: any, callback: Function) {
   const docRef = doc(firestore, collectionName, id);
   await updateDoc(docRef, data).then(() => {
      callback(true);
   }).catch(() => {
      callback(false);
   });
}

export async function deleteData(collectionName: string, id: string, callback: Function) {
   const docRef = doc(firestore, collectionName, id);
   await deleteDoc(docRef).then(() => {
      callback(true);
   }).catch(() => {
      callback(false);
   }
);
}

export async function uploadFile(userid: string, file: any, callback: Function) {
   if (file) {
      if (file.size < 1048576) {
         const newName = 'profile.' + file.name.split('.')[1];
         const storageRef = ref(storage, `images/users/${userid}/${newName}`);
         const uploadTask = uploadBytesResumable(storageRef, file);
         uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
               case 'paused':
                  console.log('Upload is paused');
                  break;
               case 'running':
                  console.log('Upload is running');
                  break;
            }
         }, (error) => {
            console.log(error.code, error.message)
            // switch (error.code) {
            //    case 'storage/unauthorized':
            //       // User doesn't have permission to access the object
            //       break;
            //    case 'storage/canceled':
            //       // User canceled the upload
            //       break;
            //    case 'storage/unknown':
            //       // Unknown error occurred, inspect error.serverResponse
            //       break;
            // }
         }, () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: any) => {
               callback(true, downloadURL);
            });
         });
      } else {
         return callback(false);
      }
   }
   
   return true;
}