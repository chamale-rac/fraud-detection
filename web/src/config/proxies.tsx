/* eslint-disable react-refresh/only-export-components */
import { proxy } from 'valtio'

interface Session {
  as: 'Client' | 'Employee' | 'Admin' | null
  uuid: string | null
}

export const sessionProxy = proxy<Session>({
  as: null,
  uuid: null,
})
