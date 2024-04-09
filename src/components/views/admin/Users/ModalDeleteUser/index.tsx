import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import userServices from "@/services/user";
import styles from './ModalDeleteUser.module.scss';
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { Dispatch, SetStateAction, useState } from "react";

type Propstypes = {
   setUsersData: Dispatch<SetStateAction<User[]>>;
   setToaster: Dispatch<SetStateAction<{}>>;
   deletedUser: User | any;
   setDeletedUser: Dispatch<SetStateAction<{}>>;
   session: any;
};

const ModalDeleteUser = (props: Propstypes) => {
   const { deletedUser, setDeletedUser, setUsersData, setToaster, session } = props;
   const [isLoading, setIsLoading] = useState(false);

   const handleDelete = async () => {
      const result = await userServices.deteleUser(deletedUser.id, session.data?.accessToken);
      if (result.status === 200) {
         setIsLoading(false);
         setToaster({
         variant: 'success',
         message: 'Success Delete User'
         });
         setDeletedUser({});
         const { data } = await userServices.getAllUsers();
         setUsersData(data.data);
      } else {
         setIsLoading(false);
         setToaster({
            variant: 'danger',
            message: 'Failed Delete User'
         });
      }
   }

   return (
      <Modal onClose={() => setDeletedUser({})}>
         <h1 className={styles.modal__title}>Anda yakin ingin menghapus data user?</h1>
         <Button type="button" variant="danger" onClick={() => handleDelete()}
         >
            {isLoading ? 'Loading...' : 'Ya, Hapus'}
            </Button>
      </Modal>
   )
} 

export default ModalDeleteUser;