import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tickets: [],
};

const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    setTickets: (state, action) => {
      state.tickets = action.payload;
    },
    updateTicketStatus: (state, action) => {
      const { ticketId, status } = action.payload;
      const ticket = state.tickets.find((t) => t._id === ticketId);
      if (ticket) {
        ticket.status = status;
      }
    },
  },
});

export const { setTickets, updateTicketStatus } = ticketSlice.actions;
export default ticketSlice.reducer;
