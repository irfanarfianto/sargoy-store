import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import userServices from "@/services/user";
import styles from './ModalDeleteUser.module.scss';
import { User } from "next-auth";
import { Dispatch, SetStateAction, useState } from "react";

type Propstypes = {
   setUsersData: Dispatch<SetStateAction<User[]>>;
   setToaster: Dispatch<SetStateAction<{}>>;
   deletedUser: User | any;
   setDeletedUser: Dispatch<SetStateAction<User | any>>;
   session: any;
};

const ModalDeleteUser = (props: Propstypes) => {
   const { deletedUser, setDeletedUser, setUsersData, setToaster, session } = props;
   const [isLoading, setIsLoading] = useState(false);

   const handleDelete = async () => {
   try {
      const result = await userServices.deleteUser(deletedUser.id, session.data?.accessToken);
      if (result.status === 200) {
         setToaster({
            variant: 'success',
            message: 'Success Delete User'
         });
         setDeletedUser({});
         const { data } = await userServices.getAllUsers();
         setUsersData(data.data);
      } else {
         // Penanganan error jika respons bukan 200
         const errorMessage = result.data.message || 'Failed Delete User';
         setToaster({
            variant: 'danger',
            message: errorMessage
         });
      }
   } catch (error) {
      // Penanganan error jika terjadi kesalahan jaringan atau server
      console.error('Error deleting user:', error);
      setToaster({
         variant: 'danger',
         message: 'Failed to delete user. Please try again later.'
      });
   } finally {
      setIsLoading(false); 
   }
}



   return (
      <Modal onClose={() => setDeletedUser({})}>
         <h1 className={styles.modal__title}>Anda yakin ingin menghapus data user?</h1>
         <Button type="button" variant="danger" onClick={() => handleDelete()}
         >
            {isLoading ? 'Deleting...' : 'Ya, Hapus'}
            </Button>
      </Modal>
   )
} 

export default ModalDeleteUser;