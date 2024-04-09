import type { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';
import { retrieveDataById, updateData } from "@/lib/firebase/service";
import { compare, hash } from "bcrypt";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'GET') {
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
         jwt.verify(token, process.env.NEXTAUTH_SECRET || '',
            async (err: any, decoded: any) => {
               if (decoded) {
                  const profile = await retrieveDataById('users', decoded.id);
                  if (profile) {
                     profile.id = decoded.id;
                      res.status(200).json({
                        status: true,
                        message: "sukses",
                        statusCode: 200,
                        data: profile,
                  });
                  } else {
                    res.status(404).json({
                        status: false,
                        message: "gagal",
                        statusCode: 404,
                        data: {},
                  });
                  }
               } else {
                  res.status(403).json({
                     status: false,
                     message: "Access denied",
                     statusCode: 403,
                     data: {},
                  });
               }
            });
      }
      // res.status(200).json({ 
      //    status: true, 
      //    message: "sukses",
      //    statusCode: 200,
      //    data: {},
      //  });
   } else if (req.method === 'PUT') {
      const { data } = req.body;
      const token = req.headers.authorization?.split(' ')[1] || '';

      jwt.verify(token, process.env.NEXTAUTH_SECRET || ' ', async (err: any, decoded: any) => {
         if (decoded) {
            if (data.password) {
               const passwordConfirm = await compare(
            data.oldPassword,
            data.encryptedPassword,
            );
            if (!passwordConfirm) {
               res
                  .status(400)
                  .json({
                        status: true,
                        statusCode: 400,
                        message: "gagal"
                     });
               }
               delete data.oldPassword;
               delete data.encryptedPassword;
               data.password = await hash(data.password, 10);
            }
            
            await updateData('users', decoded.id, data, (result: boolean) => {
               if (result) {
                  res
                     .status(200)
                     .json({
                        status: true,
                        statusCode: 200,
                        message: "sukses"
                     });
               } else {
                  res
                     .status(400)
                     .json({
                        status: false,
                        statusCode: 400,
                        message: "gagal"
                     });
               }
         });
         } else {
            res
               .status(403)
               .json({
                  status: false,
                  statusCode: 403,
                  message: "Access denied"
               });
         }
      });
   }
};