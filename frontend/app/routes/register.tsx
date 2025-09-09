import Register from "../components/register";

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border">
        <Register />
      </div>
    </div>
  );
}
