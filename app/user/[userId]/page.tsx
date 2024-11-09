"use client";

import ChatView from "@/components/ChatView";

// Page Component
export default function UserChatPage({ params }: { params: { userId: string } }) {
  const { userId } = params;

  return (
    <div>
      {/* Pass the userId as a prop to the ChatView component */}
      <ChatView userId={userId} />
    </div>
  );
}
