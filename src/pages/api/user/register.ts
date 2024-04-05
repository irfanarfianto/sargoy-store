import type { NextApiRequest, NextApiResponse } from "next";
import { signUp } from "@/services/auth";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === "POST") {
      await signUp(req.body, (status: boolean) => {
         if (status) {
            res.status(200).json({ status: true, message: "sukses" })
         }
         else {
            res.status(400).json({ status: false, message: "gagal" })
         }
      });
   }
   else {
      res.status(405).json({ message: "Method Not Allowed" });
   }
}