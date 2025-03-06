import LoginForm from "../components/LoginForm";
const AdminLoginPage = () => (
  <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>
      <LoginForm isAdmin={true} />
    </div>
  </div>
);
export default AdminLoginPage;
