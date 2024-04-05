import { getToken } from 'next-auth/jwt';
import {
   NextFetchEvent, NextMiddleware, NextRequest, NextResponse
} from 'next/server';

const onlyAdmin = ['admin'];
const authPage = ['auth'];

export default function WithAuth(
   middleware: NextMiddleware,
   requireAuth: string[] = [],
) {
   return async (req: NextRequest, next: NextFetchEvent) => {
      const pathname = req.nextUrl.pathname.split('/')[1];
      
      // Periksa apakah halaman memerlukan otentikasi
      if (requireAuth.includes(pathname)) {
         const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET
         });

         // Jika tidak ada token dan bukan halaman otentikasi, redirect ke halaman login
         if (!token && !authPage.includes(pathname)) {
            const url = new URL('/auth/login', req.url);
            url.searchParams.set('callbackUrl', encodeURI(req.url));
            return NextResponse.redirect(url);
         }

         // Jika token ada
         if (token) {
            // Jika pengguna mengakses halaman otentikasi, redirect ke halaman utama
            if (authPage.includes(pathname)) {
               return NextResponse.redirect(new URL('/', req.url));
            }

            // Jika pengguna bukan admin dan mengakses halaman yang hanya dapat diakses oleh admin, redirect ke halaman utama
            if (token.role !== 'admin' && onlyAdmin.includes(pathname)) {
               return NextResponse.redirect(new URL('/', req.url));
            }
         }
      }
      
      // Selalu kembalikan middleware berikutnya dalam rantai
      return middleware(req, next);
   };
}
