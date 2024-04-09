import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import userServices from "@/services/user";
import { User } from "@/types/user.type";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";

type Propstypes = {
   setUsersData: Dispatch<SetStateAction<User[]>>;
   setToaster: Dispatch<SetStateAction<{}>>;
   UpdatedUser: User | any;
   setUpdatedUser: Dispatch<SetStateAction<{}>>;
   session: any;
};


const ModalUpdateUser = (props: Propstypes) => {
   const { UpdatedUser, setUpdatedUser, setUsersData, setToaster, session } = props;

   const [isLoading, setIsLoading] = useState(false);
   const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
   event.preventDefault();
   setIsLoading(true);
   const form: any = event.target as HTMLFormElement;
   const data = {
      role: form.role.value
   };

   try {
      await updateUser(data);
   } catch (error) {
         handleUpdateError(error);
   } finally {
         setIsLoading(false);
      }
   };

   const updateUser = async (data: any) => {
      const result = await userServices.updateUsers(
         UpdatedUser.id,
         data,
         session.data?.accessToken
      );

      if (result.status === 200) {
         setUpdatedUser({});
         const { data } = await userServices.getAllUsers();
         setUsersData(data.data);
         setToaster({
            variant: 'success',
            message: 'Success Update User'
         });
      } else {
         const errorMessage =
            result.data.message || 'Failed to update user. Please try again later.';
         throw new Error(errorMessage);
      }
   };

   const handleUpdateError = (error: any) => {
      if (error.response) {
         const errorMessage = error.response.data.message || 'Failed to update user.';
         setToaster({
            variant: 'danger',
            message: errorMessage
         });
      } else if (error.request) {
         setToaster({
            variant: 'danger',
            message: 'Network error. Please check your internet connection and try again.'
         });
      } else {
         setToaster({
            variant: 'danger',
            message: 'An unexpected error occurred. Please try again later.'
         });
      }
   };


   return (
      <Modal onClose={() => setUpdatedUser({})}>
         <h1>Modal</h1>
         <form onSubmit={handleUpdate}>
            <Input label='Email' name='email' type='email' defaultValue={UpdatedUser?.email} disabled />
            <Input label='Nama Lengkap' name='fullname' type='text' defaultValue={UpdatedUser?.fullname} disabled />
            <Input label='Nomor Handphone' name='phone' placeholder="08xxxx" type='number' defaultValue={UpdatedUser?.phone} disabled />
            <Select label='Role' name='role' defaultValue={UpdatedUser?.role} options={[
               { value: 'admin', label: 'Admin' },
               { value: 'member', label: 'Member' }
               ]} />
            <Button type="submit" variant="primary">
               {isLoading ? 'Updating User...' : 'Update'}
            </Button>
         </form>
      </Modal>
   );
};

export default ModalUpdateUser;