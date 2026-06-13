"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import SidebarNav from "./SidebarNav";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import UserMessage from "./UserMessage";
import AssistantMessage from "./AssistantMessage";
import { RecentChat, User } from "../types";
import BillingModal from "./BillingModal";

const defaultUser: User = {
  name: "Aizen",
  plan: "Free Plan",
  avatarUrl:
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=faces",
};

const defaultRecentChats: RecentChat[] = [
  { id: "1", title: "What's Acela all about" },
  { id: "2", title: "Tell me more about Celo on base" },
  { id: "3", title: "How does one build a podcast on celo" },
];

interface ChatPageProps {
  user?: User;
  recentChats?: RecentChat[];
}

export default function ChatPage({
  user = defaultUser,
  recentChats = defaultRecentChats,
}: ChatPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [billingOpen, setBillingOpen] = useState(false);

  const handleSubmit = () => {
    if (!message.trim()) return;
    setMessage("");
  };

  return (
    <div className="flex h-screen bg-base overflow-hidden">
      <SidebarNav recentChats={recentChats} user={user} activeChatId={undefined} onMobileClose={() => setSidebarOpen(false)} mobileOpen={sidebarOpen} defaultOpen={false} onSelectChat={(id) => { }} />

      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          title="What's Acela all about"
          plan={user.plan}
          onMenuClick={() => setSidebarOpen(true)}
          onUpgradeClick={() => setBillingOpen(true)}
        />

        <main className="flex-1 overflow-y-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto py-4 md:py-8 space-y-6">
            <UserMessage text="What's Acela all about" />

            <AssistantMessage>
              <p>Acela is your personal Celo oracle</p>
              <p>
                She is an AI-powered chatbot that acts as a personal encyclopedia for the Celo
                ecosystem that you can chat with — giving anyone (especially builders) instant,
                contextual feedback on their ideas and answers to their questions, 24/7.
              </p>
              <p>Some of the things Acela can do :</p>
              <hr className="border-white/10" />
              <div>
                <p>
                  Ecosystem Q and A: Ask anything about Celo, and she will answer you. For
                  Instance asking about any of the following:
                </p>
                <ul>
                  <li>MiniPay</li>
                  <li>Tech Stack</li>
                  <li>Stablecoins</li>
                  <li>Gas fees</li>
                  <li>Smart contract tools</li>
                  <li>Etc</li>
                </ul>
              </div>
              <hr className="border-white/10" />
              <div>
                <p>
                  News and Updates: Stay Current on Celo Governance, Upgrades, Grants, and
                  Ecosystem Announcements
                </p>
                <p>Idea/Project feedback: Describe your idea and get honest, Celo-native feedback</p>
                <ul>
                  <li>Is this feasible on Celo?</li>
                  <li>What tools fit?</li>
                  <li>Does it already exist?</li>
                </ul>
              </div>
            </AssistantMessage>
          </div>
        </main>

        <div className="px-4 md:px-6 pb-4 md:pb-6">
          <div className="max-w-3xl mx-auto">
            <ChatInput
              value={message}
              onChange={setMessage}
              onSubmit={handleSubmit}
              activeMode={{ icon: HelpCircle, label: "Ask mode" }}
            />
          </div>
        </div>
      </div>
      <BillingModal open={billingOpen} onClose={() => setBillingOpen(false)} />
    </div>
  );
}
