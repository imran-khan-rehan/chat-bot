"use client";
import { useState, useEffect } from 'react';
import { User, Mail, Key, Globe, Link } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { setOpenAPIKey, addDomain } from "@/services/api"; // Import your functions
import Component from "@/components/chatLinkCopy";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    apiKey: '',
    domain: ''
  });
  const [chatUrl, setUrl] = useState<string>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if both API Key and Domain are present before proceeding
    if (!profile.apiKey || !profile.domain) {
      alert("Please fill in both API Key and Domain.");
      return;
    }

    try {
      console.log("Profile submitted:", profile);


      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No valid token found. Please log in.");
        return; 
      }
      await setOpenAPIKey(token, profile.apiKey);
      console.log("API key set successfully");

      // Call the function to add the domain
      await addDomain(token, profile.domain);
      console.log("Domain added successfully");

      alert("Profile saved successfully!");

    } catch (error) {
      console.error("Error in saving profile:", error);
      alert("There was an error in saving your profile.");
    }
  };
  useEffect(() => {
    const url =localStorage.getItem("url"); 
    setUrl(url)
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 w-100">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                    className="pl-10 w-full"
                    placeholder="John"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last Name
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                    className="pl-10 w-full"
                    placeholder="Doe"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="relative">
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="pl-10 w-full"
                  placeholder="john.doe@example.com"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-sm font-medium text-gray-700">
                OpenAI API Key
              </Label>
              <div className="relative">
                <Input
                  type="password"
                  id="apiKey"
                  name="apiKey"
                  value={profile.apiKey}
                  onChange={handleChange}
                  className="pl-10 w-full"
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  required
                />
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain" className="text-sm font-medium text-gray-700">
                Domain
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  id="domain"
                  name="domain"
                  value={profile.domain}
                  onChange={handleChange}
                  className="pl-10 w-full"
                  placeholder="example.com"
                  required
                />
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
            <Component chatUrl={chatUrl} />
            <div className="pt-4">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                Save Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
