import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { setTickets } from "../redux/ticketSlice";
import { API_BASE_URL, API_ENDPOINTS } from "../apiconfig";

class UserDashboard extends Component {
  state = {
    title: "",
    description: "",
    showModal: false,
    errorMessage: "",
    successMessage: "", // New state for success message
    loading: false,
    loadingTickets: false, // For fetching tickets
    fetchError: false, // For handling fetch errors
  };

  componentDidMount() {
    this.fetchUserTickets();
  }

  fetchUserTickets = async () => {
    this.setState({ loadingTickets: true, fetchError: false });

    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.UserTickets}`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      this.props.setTickets(response.data);
      this.setState({ successMessage: "Tickets loaded successfully!" }); // Success message
    } catch (error) {
      console.error("Error fetching tickets:", error);
      this.setState({
        fetchError: true,
        errorMessage: "Error loading tickets.",
      });
    } finally {
      this.setState({ loadingTickets: false });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description } = this.state;

    if (!title || !description) {
      this.setState({
        errorMessage: "Please enter both title and description.",
      });
      return;
    }

    this.setState({ loading: true });

    try {
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.UserCreateTickets}`,
        { title, description },
        { withCredentials: true }
      );
      this.fetchUserTickets(); // Refresh ticket list
      this.setState({
        showModal: false,
        title: "",
        description: "",
        errorMessage: "",
        successMessage: response.data.message || "Ticket created successfully!", // Success message
      });
    } catch (error) {
      console.error("Error creating ticket:", error);
      this.setState({
        errorMessage: error.response?.data?.message || "Error creating ticket.",
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
      title: "",
      description: "",
      errorMessage: "",
      successMessage: "", // Reset success message on modal toggle
      loading: false,
    }));
  };

  render() {
    const {
      showModal,
      errorMessage,
      successMessage,
      loading,
      loadingTickets,
      fetchError,
    } = this.state;
    const { tickets } = this.props;

    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>

        <button
          onClick={this.toggleModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
        >
          Create Ticket
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <div className="w-[50%] flex justify-end">
              <button
                onClick={this.toggleModal}
                className="text-white text-[60px]"
              >
                &times;
              </button>
            </div>

            <div className="bg-white p-4 shadow-md rounded-md w-1/2 relative">
              <form onSubmit={this.handleSubmit}>
                {errorMessage && (
                  <div className="text-red-500 mb-2">{errorMessage}</div>
                )}
                {successMessage && (
                  <div className="text-green-500 mb-2">{successMessage}</div> // Display success message
                )}
                <input
                  type="text"
                  placeholder="Title"
                  className="border p-2 w-full mb-2"
                  value={this.state.title}
                  onChange={(e) => this.setState({ title: e.target.value })}
                />
                <textarea
                  placeholder="Description"
                  className="border p-2 w-full mb-2"
                  value={this.state.description}
                  onChange={(e) =>
                    this.setState({ description: e.target.value })
                  }
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Create Ticket"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        <h3 className="text-xl font-bold mt-6 text-[20px]">Your Tickets</h3>

        {loadingTickets ? (
          <p className="text-gray-600">Loading...</p>
        ) : fetchError ? (
          <p className="text-red-500">Something went wrong.</p>
        ) : tickets.length === 0 ? (
          <p className="font-sans font-semibold text-blue-700">
            No tickets found. Please create tickets.
          </p>
        ) : (
          <ul>
            {tickets.map((ticket) => (
              <li key={ticket._id} className="border p-2 my-2">
                <h4 className="font-bold">{ticket.title}</h4>
                <p>{ticket.description}</p>
                <span
                  className={`text-sm font-bold text-white p-1 rounded ${
                    ticket.status === "Closed"
                      ? "bg-red-500"
                      : ticket.status === "In Progress"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                >
                  {ticket.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tickets: state.tickets.tickets,
});

export default connect(mapStateToProps, { setTickets })(UserDashboard);
