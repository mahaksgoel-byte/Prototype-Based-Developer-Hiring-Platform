// src/pages/Auth/Signup.tsx
import React, { ChangeEvent, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import mainImage from "../../assets/main.png"; // 👈 import the image

type Role = "Developer" | "Company";

export const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("Developer");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "name": setName(value); break;
      case "role": setRole(value as Role); break;
      case "email": setEmail(value); break;
      case "username": setUsername(value); break;
      case "password": setPassword(value); break;
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!data.user) throw new Error("Signup failed");

      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          email,
          name,
          username,
          role: role.toLowerCase(),
        });

      if (profileError) throw profileError;

      role === "Company"
        ? navigate("/company")
        : navigate("/developer");

    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 grid grid-cols-1 md:grid-cols-2">
      {/* LEFT: SIGNUP FORM */}
      <div className="flex items-center justify-center p-8">
        <motion.div className="w-full max-w-lg">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">
            Create your account
          </h1>
          <p className="text-zinc-500 mb-6">
            Choose your role and start immediately.
          </p>

          {error && <p className="text-red-500 mb-3">{error}</p>}

          <Card className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm text-zinc-600">Full Name</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                <input
                  name="name"
                  value={name}
                  onChange={handleChange}
                  className="w-full pl-10 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="text-sm text-zinc-600">Role</label>
              <select
                name="role"
                value={role}
                onChange={handleChange}
                className="w-full mt-1 py-2 px-3 border rounded-lg"
              >
                <option>Developer</option>
                <option>Company</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-zinc-600">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                <input
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className="w-full pl-10 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="text-sm text-zinc-600">Username</label>
              <input
                name="username"
                value={username}
                onChange={handleChange}
                className="w-full mt-1 py-2 px-3 border rounded-lg"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-zinc-600">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  className="w-full pl-10 py-2 border rounded-lg"
                />
              </div>
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-zinc-900 text-white py-2 rounded-lg hover:bg-zinc-800 transition"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </Card>

          <p className="text-sm text-zinc-500 text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-zinc-900 font-medium">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* RIGHT: IMAGE */}
      <div className="hidden md:flex items-center justify-center bg-zinc-100">
        <img
          src={mainImage}
          alt="Signup visual"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

