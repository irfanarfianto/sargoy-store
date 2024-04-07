import MemberLayout from "@/components/layouts/MemberLayout";
import styles from './Profile.module.scss';
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { uploadFile } from "@/lib/firebase/service";
import { useState } from "react";
import userServices from "@/services/user";

const ProfileMemberView = ({ profile, setProfile, session }: any) => {
   const [changeImage, setChangeImage] = useState<any>({});
   const [isLoading, setIsLoading] = useState('');

   const handleChangeProfile = async (e: any) => {
      e.preventDefault();
      setIsLoading('profile');
      

      const form = e.target as HTMLFormElement;
      const data = {
         fullname: form.fullname.value,
         phone: form.phone.value,
      };

      const result = await userServices.updateProfile(
         profile.id,
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
      } else {
         setIsLoading('');
      }
   };
   const handleChangeProfilePicture = (e: any) => {
      e.preventDefault();
      setIsLoading('picture');
      const file = e.target[0]?.files[0]
      if (file) {
         uploadFile(profile.id, file, async (status: boolean, newImageURL: string) => {
            if (status) {
               const data = {
                  image: newImageURL,
               }
               const result = await userServices.updateProfile(
                  profile.id,
                  data, session.data?.accessToken
               );
               if (result.status === 200) {
                  setIsLoading('');
                  setProfile({
                     ...profile,
                     image: newImageURL,
                  });
                  setChangeImage({});
                  e.target[0].value = '';
               } else {
                  setIsLoading('');
               }
            } else {
               setChangeImage({});
               setIsLoading('');
            }
         });
      }
   };

   const handleChangePassword = async (e: any) => {
      e.preventDefault();
      setIsLoading('password');
      const form = e.target as HTMLFormElement;
      const data = {
         oldPassword: form['old-password'].value,
         password: form['new-password'].value,
         encryptedPassword: profile.password
      };

      const result = await userServices.updateProfile(
         profile.id,
         data, session.data?.accessToken
      );
      if (result.status === 200) {
         setIsLoading('');
         form.reset();
      } else {
         setIsLoading('');
      }
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
                     <Input type="text" label='Fullname' name='fullname' defaultValue={profile.fullname} />
                     <Input type="number" label='Nomor Handphone' name='phone' defaultValue={profile.phone} />
                     <Input type="text" label='Email' name='email' defaultValue={profile.email} disabled />
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
                     <Input name="old-password" type="password" label="Password lama" />
                     <Input name="new-password" type="password" label="Password baru" />
                     <Button type="submit">{isLoading === 'password' ? 'Loading...' : 'Update Password'}</Button>
                  </form>
               </div>
            </div>
         </div>
      </MemberLayout>
   )
}

export default ProfileMemberView;