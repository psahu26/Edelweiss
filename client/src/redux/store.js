import { configureStore } from '@reduxjs/toolkit'
import dataPacket from './dataPacket'

export const store = configureStore({
  reducer: {
    dataPackets: dataPacket
  },
})