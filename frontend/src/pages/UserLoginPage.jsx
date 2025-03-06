import LoginForm from "../components/LoginForm";
const UserLoginPage = () => (
  <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold text-center mb-4">User Login</h2>
      <LoginForm isAdmin={false} />
    </div>
  </div>
);
export default UserLoginPage;
