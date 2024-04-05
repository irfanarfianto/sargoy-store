import Link from 'next/link';
import styles from './Register.module.scss';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import authServices from '@/services/auth';
import AuthLayout from '@/components/layouts/AuthLayout';

const RegisterView = () => {
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');

   const { push } = useRouter();

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

      event.preventDefault();
      setIsLoading(true);
      setError('');

      const form = event.target as HTMLFormElement;
      const data = {
         email: form.email.value,
         fullname: form.fullname.value,
         phone: form.phone.value,
         password: form.password.value
      };

      const result = await authServices.registerAccount(data);

      if (result.status === 200) {
         form.reset();
         setIsLoading(false);
         push('/auth/login');
      } else {
         setIsLoading(false);
         setError("Email sudah digunakan");
      }
   };


   return (
      <AuthLayout title='Register' error={error} link='/auth/login' linkText='Sudah punya akun? Login '>
         <form onSubmit={handleSubmit}>
               <Input label='Email' name='email' type='email' />
               <Input label='Nama Lengkap' name='fullname' type='text' />
               <Input label='Nomor Handphone' name='phone' type='number' />
               <Input label='Password' name='password' type='password' />
               <Button type='submit' className={styles.register__button} variant='primary'>{isLoading ? 'Loading...' : 'Register'}</Button>
         </form>
      </AuthLayout>
      
   );
}

export default RegisterView;