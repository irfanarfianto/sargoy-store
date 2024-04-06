import instance from '@/lib/axios/instance';

export const userServices = {
   getAllUsers: () => instance.get('/api/user'),

   updateUsers: (id: string, data: any) => instance.put('/api/user', { data, id }),
   deteleUser: (id: string) => instance.delete(`/api/user/${id}`),
};

export default userServices;