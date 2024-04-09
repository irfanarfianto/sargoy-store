import MemberLayout from "@/components/layouts/MemberLayout";
import styles from './Profile.module.scss';
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { uploadFile } from "@/lib/firebase/service";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import userServices from "@/services/user";
import { User } from "@/types/user.type";

type Propstypes = {
   profile: User | any;
   setProfile: Dispatch<SetStateAction<{}>>;
   session: any;
   setToaster: Dispatch<SetStateAction<{}>>;
};

const ProfileMemberView = ({ profile, setProfile, session, setToaster }: Propstypes) => {
   const [changeImage, setChangeImage] = useState<File | any>({});
   const [isLoading, setIsLoading] = useState('');

   const handleChangeProfile = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading('profile');
      

      const form = e.target as HTMLFormElement;
      const data = {
         fullname: form.fullname.value,
         phone: form.phone.value,
      };

      const result = await userServices.updateProfile(
         data, session.data?.accessToken
      );
      if (result.status === 200) {
         setIsLoading('');
         setProfile({
            ...profile,
            fullname: data.fullname,
            phone: data.phone,
         });
         form.reset();
         setToaster({
            variant: 'success',
            message: 'Success Update Profile'
         });
      } else {
         setIsLoading('');
      }
   };
   const handleChangeProfilePicture = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading('picture');
      const form = e.target as HTMLFormElement;
      const file = form.image.files[0]
      if (file) {
         if (file.size > 1024 * 1024) { // Validasi ukuran file maksimum (1 MB)
         setToaster({
            variant: 'error',
            message: 'Maximum file size exceeded. Please upload an image with maximum size of 1 MB.'
         });
         setIsLoading('');
         return;
         }
         uploadFile(profile.id, file, async (status: boolean, newImageURL: string) => {
            if (status) {
               const data = {
                  image: newImageURL,
               }
               const result = await userServices.updateProfile(
                  data, session.data?.accessToken
               );
               if (result.status === 200) {
                  setIsLoading('');
                  setProfile({
                     ...profile,
                     image: newImageURL,
                  });
                  setChangeImage({});
                  form.reset();
                  setToaster({
                     variant: 'success',
                     message: 'Success Change Avatar'
                  });
               } else {
                  setIsLoading('');
               }
            } else {
               setChangeImage({});
               setIsLoading('');
               setToaster({
                  variant: 'error',
                  message: 'Failed Change Avatar'
               });
            }
         });
      }
   };

   const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading('password');
      const form = e.target as HTMLFormElement;
      const data = {
         oldPassword: form['old-password'].value,
         password: form['new-password'].value,
         encryptedPassword: profile.password
      };

      try {
            const result = await userServices.updateProfile(
            data, session.data?.accessToken
         );
         if (result.status === 200) {
            setIsLoading('');
            form.reset();
            setToaster({
               variant: 'success',
               message: 'Success Change Password'
            });
         };
      } catch (error) {
         setIsLoading('');
            setToaster({
               variant: 'error',
               message: 'Failed Change password'
            });
      };
   };
   return (
      <MemberLayout>
         <h1 className={styles.profile__title}>Profile</h1>
         <div className={styles.profile__main}>
            <div className={styles.profile__main__row}>
               <div className={styles.profile__main__row__avatar}>
               <h2 className={styles.profile__main__row__avatar__title}>Avatar</h2>
               <div className={styles.profile__main__row__avatar__container}>
                 {profile.image ? (
                     <Image className={styles.profile__main__row__avatar__container__image}
                        src={profile.image}
                        alt={profile.fullname}
                        width={100}
                        height={100}
                     />
                  ) : (
                        <div className={styles.profile__main__row__avatar__container__image}>
                           {profile?.fullname?.charAt(0)}
                     </div>
                  )}
               </div>
               <form onSubmit={handleChangeProfilePicture}>
                  <label htmlFor="upload-image" className={styles.profile__main__row__avatar__label}>
                     {changeImage.name ? (
                        <p>{changeImage.name}</p>
                     ) : (
                           <>
                              <i className='bx bxs-edit'></i>
                              <p>
                                 Upload a new avatar, max 1 MB
                              </p>
                           </>
                     )}
                     
                  </label>
                  <input onChange={(e: any) => {
                     e.preventDefault();
                     setChangeImage(e.currentTarget.files[0]);
                  }} type="file" name="image" id="upload-image" className={styles.profile__main__row__avatar__input} />
                  <Button type="submit" variant="primary" className={styles.profile__main__row__avatar__button}>
                     {isLoading === 'picture' ? 'Uploading...' : 'Upload'}
                  </Button>
               </form>
               </div>
               <div className={styles.profile__main__row__profile}>
                  <h2 className={styles.profile__main__row__profile__title}>Profile</h2>
                  <form onSubmit={handleChangeProfile}>
                     <Input type="text" label='Nama Lengkap' name='fullname' placeholder='Masukkan nama lengkap' defaultValue={profile.fullname} />
                     <Input type="number" label='Nomor Handphone' name='phone' placeholder='Masukkan nomor handphone' defaultValue={profile.phone} />
                     <Input type="text" label='Email' name='email' placeholder='Masukkan email' defaultValue={profile.email} disabled />
                     <Input type="text" label='Role' name='role' defaultValue={profile.role} disabled />
                     {/* <Input type="password" label='Password' name='password' defaultValue={profile.password} /> */}
                     <Button type="submit" variant="primary">
                        {isLoading === 'profile' ? 'Loading...' : 'Update Profile'}
                     </Button>
                  </form>
               </div>
               <div className={styles.profile__main__row__password}>
                  <h2>Change Password</h2>
                  <form onSubmit={handleChangePassword}>
                     <Input
                        name="old-password"
                        type="password"
                        label="Password lama"
                        disabled={profile.type === 'google'}
                        placeholder="Masukkan password lama"
                     />
                     <Input
                        name="new-password"
                        type="password"
                        label="Password baru"
                        disabled={profile.type === 'google'}
                        placeholder="Masukkan password baru"
                     />
                     <Button type="submit" disabled={isLoading === 'password' || profile.type === 'google'} variant="primary">{isLoading === 'password' ? 'Loading...' : 'Update Password'}</Button>
                  </form>
               </div>
            </div>
         </div>
      </MemberLayout>
   )
}

export default ProfileMemberView;