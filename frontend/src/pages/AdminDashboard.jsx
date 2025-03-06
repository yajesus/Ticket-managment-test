import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { setTickets, updateTicketStatus } from "../redux/ticketSlice";
import { API_BASE_URL, API_ENDPOINTS } from "../apiconfig";
class AdminDashboard extends Component {
  state = {
    loading: true,
    error: false,
  };

  componentDidMount() {
    this.fetchAllTickets();
  }

  fetchAllTickets = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.AdminTickets}`,
        {
          withCredentials: true,
        }
      );
      this.props.setTickets(response.data);
      this.setState({ loading: false });
    } catch (error) {
      console.error("Error fetching tickets:", error);
      this.setState({ error: true, loading: false });
    }
  };

  handleStatusChange = async (ticketId, status) => {
    try {
      await axios.put(
        `${API_BASE_URL}${API_ENDPOINTS.AdminTickets}/${ticketId}`,
        { status },
        { withCredentials: true }
      );
      this.props.updateTicketStatus({ ticketId, status });
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  render() {
    const { loading, error } = this.state;
    const { tickets } = this.props;

    return (
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

        <h3 className="text-xl font-bold mt-6">All Tickets</h3>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Something went wrong.</p>}
        {!loading && !error && tickets.length === 0 && <p>No tickets found.</p>}

        <ul>
          {tickets.map((ticket) => (
            <li
              key={ticket._id}
              className="border p-2 my-2 flex justify-between"
            >
              <div>
                <h4 className="font-bold">{ticket.title}</h4>
                <p>{ticket.description}</p>
                <span className="text-sm text-gray-500">{ticket.status}</span>
              </div>
              <select
                className="border p-1"
                value={ticket.status}
                onChange={(e) =>
                  this.handleStatusChange(ticket._id, e.target.value)
                }
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tickets: state.tickets.tickets,
});

export default connect(mapStateToProps, { setTickets, updateTicketStatus })(
  AdminDashboard
);
