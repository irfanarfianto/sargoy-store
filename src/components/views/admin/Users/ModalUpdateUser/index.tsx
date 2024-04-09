import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import userServices from "@/services/user";
import { User } from "@/types/user.type";
import { useSession } from "next-auth/react";
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

      const result = await userServices.updateUsers(
         UpdatedUser.id,
         data, session.data?.accessToken
      );
      if (result.status === 200) {
         setIsLoading(false);
         setUpdatedUser({});
         const { data } = await userServices.getAllUsers();
         setUsersData(data.data);
         setToaster({
            variant: 'success',
            message: 'Success Update User'
         });
      } else {
         setIsLoading(false);
         setToaster({
            variant: 'danger',
            message: 'Failed Update User'
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
               {isLoading ? 'Updating...' : 'Update'}
            </Button>
         </form>
      </Modal>
   );
};

export default ModalUpdateUser;