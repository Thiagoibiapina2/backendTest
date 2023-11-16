import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '../database/prisma'

import { compare } from 'bcrypt'

export const options = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        // name: { label: 'Name', type: 'name' },
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials ?? {}
        if (!email || !password) {
          throw new Error('Missing username or password')
        }
        const User = await prisma.user.findUnique({
          where: {
            email,
          },
        })
        if (!User || !(await compare(password, User.password))) {
          throw new Error('Invalid password')
        }
        return User
      },
    }),
  ],
}
